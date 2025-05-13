export const FrequencyUpsellOptionsDefaults = {
    content: "Before we process your donation, would you like to make it an annual gift?",
    yesButton: "YES! Process my gift as an annual gift of ${current_amount}",
    noButton: "NO! Process my gift as a one-time gift of ${upsell_amount}",
    upsellFrequency: "annual",
    upsellFromFrequency: ["onetime"],
    upsellAmount: (currentAmount) => currentAmount,
    onAccept: () => { },
    onDecline: () => { },
};
