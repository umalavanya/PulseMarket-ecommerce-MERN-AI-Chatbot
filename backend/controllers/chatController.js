const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Store policies and general info context
const STORE_POLICIES = `
ShopSphere Store Policies & Info:
- Return Policy: 30-day hassle-free return policy. Unused items in original packaging can be returned for a full refund or exchange.
- Shipping Policy: Free standard shipping on all orders over $150. Standard shipping takes 2-4 business days. Express shipping is available for $15 (1-2 business days).
- Payment Methods: We accept Credit Cards, PayPal, and Cash on Delivery (COD).
- Customer Support: Email support@shopsphere.com (24/7 support team).
- Order Tracking: Logged-in users can check order status directly in the chat or on their Account / Orders page.
- Warranty: All electronic items come with a 1-year manufacturer warranty.
`;

/**
 * Handle AI Shopping Assistant Chat messages
 * POST /api/chat/message
 */
const handleChatMessage = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ message: 'Please provide a valid message' });
    }

    const userQuery = message.trim();
    const lowerQuery = userQuery.toLowerCase();

    // 1. Detect Intent: Order Status Query
    const isOrderQuery = /order|status|tracking|deliver|package|where is my order|my order|order #|order id/i.test(lowerQuery);

    if (isOrderQuery) {
      // Constraint: Only logged-in users can access order-related queries
      if (!req.user) {
        return res.json({
          reply: '🔒 **Order status queries are only available for logged-in users.**\n\nPlease log in to your account to view your order details and tracking status.',
          requiresLogin: true,
          products: [],
        });
      }

      // Fetch user's orders from DB
      const userOrders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5);

      if (!userOrders || userOrders.length === 0) {
        return res.json({
          reply: `Hello ${req.user.name}, you don't have any placed orders yet. Explore our product catalog to place your first order!`,
          requiresLogin: false,
          products: [],
        });
      }

      // Check if user specified a specific Order ID (hex string or snippet)
      const orderIdMatch = lowerQuery.match(/[0-9a-fA-F]{5,24}/);
      let selectedOrders = userOrders;
      if (orderIdMatch) {
        const queryId = orderIdMatch[0].toLowerCase();
        const matched = userOrders.filter(o => o._id.toString().toLowerCase().includes(queryId));
        if (matched.length > 0) {
          selectedOrders = matched;
        }
      }

      // Construct order context for Gemini / Fallback
      let orderContextText = `User Information: Name: ${req.user.name}, Email: ${req.user.email}\nUser's Recent Orders:\n`;
      selectedOrders.forEach((o, idx) => {
        const dateStr = new Date(o.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        const itemsSummary = o.orderItems.map(item => `${item.qty}x ${item.name} ($${item.price})`).join(', ');
        const statusText = o.isDelivered
          ? `Delivered on ${new Date(o.deliveredAt).toLocaleDateString()}`
          : 'Processing / In Transit';
        const paymentText = o.isPaid ? 'Paid' : 'Pending Payment';

        orderContextText += `${idx + 1}. Order ID: ${o._id}\n   Date: ${dateStr}\n   Status: ${statusText}\n   Payment: ${paymentText} (${o.paymentMethod})\n   Total Price: $${o.totalPrice}\n   Items: ${itemsSummary}\n   Shipping Address: ${o.shippingAddress.address}, ${o.shippingAddress.city}, ${o.shippingAddress.postalCode}\n\n`;
      });

      // Try Gemini API call for personalized natural language answer
      const responseText = await callGeminiAI({
        userQuery,
        systemInstruction: `You are ShopSphere's AI Shopping Assistant. The logged-in customer (${req.user.name}) is asking about their order status. Use the provided order details to answer accurately and politely. Highlight order IDs, status, delivery date, and item details.`,
        contextData: orderContextText,
        conversationHistory,
      });

      if (responseText) {
        return res.json({
          reply: responseText,
          orders: selectedOrders.map(o => ({
            _id: o._id,
            totalPrice: o.totalPrice,
            isDelivered: o.isDelivered,
            deliveredAt: o.deliveredAt,
            createdAt: o.createdAt,
            itemCount: o.orderItems.length,
          })),
          products: [],
        });
      }

      // Local fallback for order queries if Gemini API key is missing or fails
      let fallbackOrderReply = `### 📦 Order Status for ${req.user.name}\n\nHere are your recent orders:\n\n`;
      selectedOrders.forEach((o) => {
        const dateStr = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const statusBadge = o.isDelivered ? '✅ Delivered' : '🚚 Processing / In Transit';
        fallbackOrderReply += `**Order #${o._id}**\n- **Date:** ${dateStr}\n- **Status:** ${statusBadge}\n- **Total Amount:** $${o.totalPrice.toFixed(2)}\n- **Payment:** ${o.paymentMethod} (${o.isPaid ? 'Paid' : 'Pending'})\n- **Items:** ${o.orderItems.map(i => `${i.qty}x ${i.name}`).join(', ')}\n\n`;
      });

      return res.json({
        reply: fallbackOrderReply,
        orders: selectedOrders,
        products: [],
      });
    }

    // 2. Detect Intent: Product Recommendations & Search
    const isRecommendQuery = /recommend|show|find|shoes|laptop|headphones|gear|watch|phone|under \$?\d+|cheap|best|running|wearable|electronics|footwear|accessories|gaming|smart home|photography|workspace|fitness|appliance|pet|luggage/i.test(lowerQuery);

    // Extract price constraint if present (e.g. "under $100", "under 150")
    const priceMatch = lowerQuery.match(/(?:under|below|less than|\$)\s*\$?(\d+)/i);
    let maxPrice = priceMatch ? parseFloat(priceMatch[1]) : null;

    // Build DB search query for products
    let dbFilter = {};
    if (maxPrice) {
      dbFilter.price = { $lte: maxPrice };
    }

    // Extract potential search keywords
    const keywords = ['shoes', 'running', 'leather', 'backpack', 'camera', 'laptop', 'keyboard', 'headphone', 'watch', 'gaming', 'coffee', 'vacuum', 'chair', 'yoga', 'drone', 'earbuds', 'speaker', 'light', 'pet', 'tent'];
    const matchedKeywords = keywords.filter(kw => lowerQuery.includes(kw));

    if (matchedKeywords.length > 0) {
      dbFilter.$or = matchedKeywords.map(kw => ({
        $or: [
          { name: { $regex: kw, $options: 'i' } },
          { category: { $regex: kw, $options: 'i' } },
          { description: { $regex: kw, $options: 'i' } },
        ]
      }));
    }

    let recommendedProducts = await Product.find(dbFilter)
      .sort({ rating: -1, numReviews: -1 })
      .limit(6);

    // If specific search returned no items, fallback to top rated products
    if (recommendedProducts.length === 0) {
      recommendedProducts = await Product.find({})
        .sort({ rating: -1, numReviews: -1 })
        .limit(6);
    }

    // Prepare product context
    let productContextText = 'Available Products in ShopSphere Catalog:\n';
    recommendedProducts.forEach((p, idx) => {
      productContextText += `${idx + 1}. ID: ${p._id} | Name: ${p.name} | Category: ${p.category} | Brand: ${p.brand} | Price: $${p.price} | Rating: ${p.rating}⭐ (${p.numReviews} reviews) | Stock: ${p.countInStock}\n   Description: ${p.description}\n\n`;
    });

    // 3. Detect Intent: Product Comparison
    const isCompareQuery = /compare|vs|versus|difference between/i.test(lowerQuery);

    // 4. Call Gemini AI with collected context
    let systemInstruction = `You are ShopSphere's friendly, highly intelligent AI Shopping Assistant. 
Help customers with product recommendations, product comparisons, and general shopping queries.
Format your responses beautifully using GitHub Markdown (bolding, bullet points, headers).
When recommending products, mention their exact names, prices ($), star ratings, and key features from the provided catalog context.
Be helpful, enthusiastic, concise, and accurate.`;

    if (isCompareQuery) {
      systemInstruction += ` The user wants a detailed product comparison. Compare the requested products or product types highlighting key features, specs, pricing, pros/cons, and recommended use-cases.`;
    }

    const fullContextText = `${STORE_POLICIES}\n\n${productContextText}`;

    const geminiReply = await callGeminiAI({
      userQuery,
      systemInstruction,
      contextData: fullContextText,
      conversationHistory,
    });

    if (geminiReply) {
      return res.json({
        reply: geminiReply,
        products: recommendedProducts.map(p => ({
          _id: p._id,
          name: p.name,
          price: p.price,
          rating: p.rating,
          numReviews: p.numReviews,
          image: p.image,
          category: p.category,
          brand: p.brand,
        })),
      });
    }

    // Local Fallback if Gemini Key is missing or unavailable
    let fallbackReply = '';

    if (isCompareQuery) {
      fallbackReply = `### 📊 Product Comparison Summary\n\n`;
      if (recommendedProducts.length >= 2) {
        const p1 = recommendedProducts[0];
        const p2 = recommendedProducts[1];
        fallbackReply += `Here is a breakdown of **${p1.name}** vs **${p2.name}**:\n\n`;
        fallbackReply += `| Feature | **${p1.name}** | **${p2.name}** |\n`;
        fallbackReply += `|---|---|---|\n`;
        fallbackReply += `| **Brand** | ${p1.brand} | ${p2.brand} |\n`;
        fallbackReply += `| **Price** | $${p1.price.toFixed(2)} | $${p2.price.toFixed(2)} |\n`;
        fallbackReply += `| **Rating** | ${p1.rating} ⭐ (${p1.numReviews}) | ${p2.rating} ⭐ (${p2.numReviews}) |\n`;
        fallbackReply += `| **Category** | ${p1.category} | ${p2.category} |\n\n`;
        fallbackReply += `**Recommendation:** Both are top quality in our store! Choose **${p1.name}** for ${p1.brand} features or **${p2.name}** for a price of $${p2.price}.`;
      } else {
        fallbackReply += `To perform a product comparison, select products from our catalog or specify items like "Compare audio headphones vs earbuds".`;
      }
    } else if (isRecommendQuery || maxPrice || matchedKeywords.length > 0) {
      fallbackReply = `### 🛍️ Recommended Products for You\n\n`;
      if (maxPrice) {
        fallbackReply += `Here are top rated items under **$${maxPrice}** matching your request:\n\n`;
      } else {
        fallbackReply += `Based on your request, here are top recommendations from our catalog:\n\n`;
      }

      recommendedProducts.slice(0, 4).forEach((p) => {
        fallbackReply += `* **${p.name}** — **$${p.price.toFixed(2)}** (${p.rating} ⭐)\n  _${p.description.substring(0, 100)}..._\n\n`;
      });
    } else {
      fallbackReply = `### 👋 Welcome to ShopSphere AI Assistant!\n\nI can help you with:\n- 🛍️ **Product Recommendations** ("Show me running shoes under $100")\n- 📦 **Order Status Queries** ("Where is my order #12345?")\n- 📊 **Product Comparison** ("Compare headphones vs earbuds")\n- ❓ **Store Policies & Support** ("What is your return policy?")\n\nHow can I assist your shopping today?`;
    }

    return res.json({
      reply: fallbackReply,
      products: recommendedProducts.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        rating: p.rating,
        numReviews: p.numReviews,
        image: p.image,
        category: p.category,
        brand: p.brand,
      })),
    });

  } catch (error) {
    console.error('Chat API Controller Error:', error);
    return res.status(500).json({
      reply: 'Sorry, I encountered a temporary error processing your request. Please try again.',
      error: error.message,
    });
  }
};

/**
 * Helper to invoke Google Gemini Generative AI SDK
 */
async function callGeminiAI({ userQuery, systemInstruction, contextData, conversationHistory }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('GEMINI_API_KEY not configured. Falling back to local smart assistant.');
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Models to try in order of availability
    const candidateModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction,
        });

        // Build prompt with context data and query
        let promptText = `STORE & CATALOG CONTEXT:\n${contextData}\n\n`;

        if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
          promptText += `RECENT CONVERSATION HISTORY:\n`;
          conversationHistory.slice(-4).forEach(msg => {
            promptText += `${msg.sender === 'user' ? 'Customer' : 'Assistant'}: ${msg.text}\n`;
          });
          promptText += `\n`;
        }

        promptText += `CUSTOMER QUERY: ${userQuery}\n\nPlease provide a clear, helpful, well-formatted response:`;

        const result = await model.generateContent(promptText);
        const response = await result.response;
        const text = response.text();

        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch (err) {
        lastError = err;
        console.warn(`Gemini model ${modelName} call failed:`, err.message);
      }
    }

    if (lastError) {
      console.error('All Gemini model calls failed, using local fallback:', lastError.message);
    }
    return null;
  } catch (err) {
    console.error('Error in callGeminiAI:', err.message);
    return null;
  }
}

module.exports = { handleChatMessage };
