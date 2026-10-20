// Product page copy for each candle, kept apart from data/candles.js so
// that the cart, which every page loads, does not carry it.

export const candleCopy = Object.freeze({
  love: Object.freeze({
    description:
      "Our rose otto, ylang ylang, orange, and patchouli scented candle smells divine and has been precisely paired with rose quartz chips and rose buds to amplify and attract love into your life. Rose Quartz is a very popular crystal, and one of our favourites for its powerful and varied benefits. Rose Quartz is calming; providing a reassuring and gentle atmosphere to any room. Rose quartz promotes love, friendship, healing and deep inner peace but most importantly, rose quartz has the powerful ability to dispel negativity and replace it with positive energies. This is why we chose to imbue our rose otto, ylang ylang, orange, and patchouli candle with rose quartz. We truly believe it will amplify the loves in your life to new heights!",
  }),
  happiness: Object.freeze({
    description:
      "Fill the room with positive energies and appreciation for all the good in life with the beautiful scents of wild orange, clary sage, and lemon. This candle comes paired with citrine chips that channel happiness, and jasmine flower petals for clarity and perspective. Citrine is a powerful crystal with a deep, cheerful colouring. It promotes optimism, happiness and it is believed to manifest financial good fortunes. The sight and scents of this candle will help you appreciate the little things and spread cheer and happiness throughout your home and life.",
  }),
  dreams: Object.freeze({
    description:
      "Follow your dreams with our lavender, chamomile, and frankincense candle. Paired with the powerful energy of amethyst crystals to provide clarity of mind, and cornflowers to bring wealth and good fortune. Amethyst stones are a symbol of peace, of cleansing and calming energies. The relaxing scent of this candle paired with the clarity of mind from the amethyst crystals will help ground you and help you focus on what really matters to you in life, whatever that may be. We truly believe this candle helps us reach for the stars.",
  }),
  summer: Object.freeze({
    description:
      "Bring on the summer vibes with our coconut, mango, and lime scented candle. Paired with both aventurine crystal shards for good blessings and lavender flowers for peace and grace. This candle smells like summers by the beach, the scent will bring you back to good times in the sun with family and friends and the powerful aventurine crystal shards will help you seize the day. Aventurine is a stone of positive prosperity. It promotes compassion, leadership and perseverance by amplifying the natural strengths within you. It also helps you let go of negative emotions and focus on the positives.",
  }),
});

export const descriptionFor = (slug) => candleCopy[slug]?.description ?? "";
