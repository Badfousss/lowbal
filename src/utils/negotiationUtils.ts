export const calculateCounterOffer = (price: number, selectedPlatform: string, category?: string): number => {
  let percentage = 0;
  
  // Category-specific negotiation percentages
  if (category) {
    switch (category) {
      case 'real-estate':
        percentage = Math.random() * 0.05 + 0.02; // 2-7% for real estate
        break;
      case 'cars':
        percentage = Math.random() * 0.15 + 0.10; // 10-25% for cars
        break;
      case 'motorcycles':
        percentage = Math.random() * 0.12 + 0.08; // 8-20% for motorcycles
        break;
      case 'electronics':
        percentage = Math.random() * 0.20 + 0.15; // 15-35% for electronics
        break;
      case 'gadgets':
        percentage = Math.random() * 0.18 + 0.12; // 12-30% for gadgets
        break;
      case 'furniture':
        percentage = Math.random() * 0.25 + 0.20; // 20-45% for furniture
        break;
      default:
        percentage = Math.random() * 0.15 + 0.15; // 15-30% default
    }
  } else {
    // Original platform-based logic as fallback
    if ((selectedPlatform === 'Zillow' || selectedPlatform === 'Facebook') && price > 5000) {
      percentage = Math.random() * 0.1 + 0.1; // 10-20%
    } else if ((selectedPlatform === 'eBay' || selectedPlatform === 'Craigslist') && price < 500) {
      percentage = Math.random() * 0.1 + 0.2; // 20-30%
    } else {
      percentage = Math.random() * 0.1 + 0.15; // 15-25% for other cases
    }
  }
  
  const reducedPrice = price * (1 - percentage);
  
  // Round down to appropriate increments based on price range
  if (reducedPrice > 10000) {
    return Math.floor(reducedPrice / 500) * 500; // Round to nearest $500
  } else if (reducedPrice > 1000) {
    return Math.floor(reducedPrice / 100) * 100; // Round to nearest $100
  } else if (reducedPrice > 100) {
    return Math.floor(reducedPrice / 50) * 50; // Round to nearest $50
  } else {
    return Math.floor(reducedPrice / 10) * 10; // Round to nearest $10
  }
};

export const generateNegotiationMessage = async (
  title: string, 
  originalPrice: number, 
  offer: number, 
  platform: string, 
  notes: string, 
  category?: string,
  tone?: string
): Promise<string> => {
  const prompt = `Create a polite, confident negotiation message for the following:
  - Item: ${title}
  - Category: ${category || 'general'}
  - Original Price: $${originalPrice}
  - My Offer: $${offer}
  - Platform: ${platform}
  - Tone: ${tone || 'professional'}
  - Additional Context: ${notes}
  
  Guidelines:
  - Be respectful but confident
  - Use category-specific language and approach
  - Adapt tone based on the selected tone preference
  - Use phrases like "Would you consider," "Based on the market," or "Happy to move forward if we can agree"
  - Keep it concise (2-3 sentences)
  - Sound professional but friendly
  - Don't be aggressive or pushy
  - Focus on being ready to move forward with the deal
  - Include category-specific benefits (e.g., quick closing for real estate, immediate pickup for electronics)`;

  try {
    // This is a placeholder for GPT-4 integration
    console.log('Generating message with prompt:', prompt);
    
    // Tone-specific message variations
    const toneVariations = {
      'friendly': {
        'real-estate': [
          `Hi there! I absolutely love your property at ${title}. I'm a pre-qualified buyer and would love to make this work. Based on recent sales in the area, would you be open to considering $${offer}? I'm excited to move forward quickly if we can find common ground! 😊`,
          `Hello! Your property looks amazing and exactly what my family has been searching for. I have financing ready and can close fast. Given the current market, would $${offer} work for you? I'd be thrilled to discuss this further!`
        ],
        'cars': [
          `Hi! I'm really excited about your ${title} - it looks perfect for what I need! I've been searching for this exact model. Based on similar cars I've seen, would you consider $${offer}? I'm ready to come check it out this week! 🚗`,
          `Hello! Your ${title} caught my eye immediately. I'm a serious buyer with financing ready. Would you be open to $${offer}? I'd love to schedule a viewing soon!`
        ],
        'electronics': [
          `Hi! Your ${title} is exactly what I've been looking for! I'm ready to pick it up today with cash. Based on current prices, would you consider $${offer}? Thanks so much! 📱`,
          `Hello! I'm very interested in your ${title}. Would you be open to $${offer}? I can come get it whenever works best for you!`
        ]
      },
      'professional': {
        'real-estate': [
          `Good day. I am writing to express my interest in your property listed at ${title}. As a pre-qualified buyer, I am prepared to proceed expeditiously. Based on current market analysis, I would like to propose an offer of $${offer}. I am available to discuss terms at your convenience.`,
          `Dear Seller, I am interested in purchasing your property. I have secured financing and can accommodate your preferred closing timeline. Given recent comparable sales, would you consider an offer of $${offer}?`
        ],
        'cars': [
          `Good day. I am interested in your ${title}. I have financing pre-approved and am prepared to complete the transaction promptly. Based on current market values, would you consider $${offer}? I am available for inspection at your convenience.`,
          `Hello. I would like to inquire about your ${title}. I am a qualified buyer ready to proceed. Would you be amenable to an offer of $${offer}?`
        ],
        'electronics': [
          `Good day. I am interested in purchasing your ${title}. I am prepared to complete the transaction immediately upon agreement. Based on current market pricing, would you consider $${offer}?`,
          `Hello. I would like to make an offer on your ${title}. I can arrange immediate pickup and payment. Would $${offer} be acceptable?`
        ]
      },
      'confident': {
        'real-estate': [
          `I'm very interested in your property at ${title}. I'm a cash buyer with proof of funds ready. The market data supports an offer of $${offer} for this property. I can close in 15 days. Let me know if you'd like to move forward.`,
          `Your property fits exactly what I'm looking for. I have financing locked and can close quickly. Based on recent comps, I'm offering $${offer}. This is a strong offer in today's market.`
        ],
        'cars': [
          `I want your ${title}. I've done my research and know the market well. My offer is $${offer} - this is fair based on current values and condition. I have cash ready and can close this week.`,
          `Your ${title} is exactly what I need. I'm offering $${offer} based on market analysis. I'm ready to buy today if you accept.`
        ],
        'electronics': [
          `I'll take your ${title} for $${offer}. This is a fair market price and I can pick it up today with cash. Let me know if you want to close this deal.`,
          `I'm offering $${offer} for your ${title}. I know the market and this is a solid offer. Cash in hand, can pick up immediately.`
        ]
      },
      'humble': {
        'real-estate': [
          `I hope you're doing well. I'm very interested in your beautiful property at ${title}. I understand you probably have many interested buyers. If you would consider $${offer}, I would be incredibly grateful. I'm pre-qualified and can work with your timeline.`,
          `Thank you for listing such a lovely property. I would be honored to purchase your home. Would you please consider an offer of $${offer}? I'm flexible on terms and timing.`
        ],
        'cars': [
          `I hope I'm not bothering you. Your ${title} looks absolutely perfect for my needs. I would be very grateful if you would consider $${offer}. I promise to take excellent care of it.`,
          `Thank you for your time. I'm very interested in your ${title}. Would you please consider $${offer}? I understand if it's not enough, but I thought I'd ask respectfully.`
        ],
        'electronics': [
          `I hope you don't mind me reaching out. Your ${title} would be perfect for my needs. Would you please consider $${offer}? I would really appreciate it and can pick up at your convenience.`,
          `Thank you for listing your ${title}. I would be very grateful if you would consider $${offer}. I understand if you need more, but I thought I'd ask politely.`
        ]
      }
    };

    const selectedTone = tone || 'professional';
    const categoryTemplates = toneVariations[selectedTone as keyof typeof toneVariations]?.[category as keyof typeof toneVariations['professional']] || 
                             toneVariations[selectedTone as keyof typeof toneVariations]?.['electronics'] ||
                             toneVariations['professional']['electronics'];
    
    return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
  } catch (error) {
    console.error('Error generating message:', error);
    return `Hi! I'm very interested in your ${title}. Would you consider $${offer}? I'm ready to move forward if we can agree on this price. Thank you!`;
  }
};