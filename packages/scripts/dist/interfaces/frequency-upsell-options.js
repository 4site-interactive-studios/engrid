export const FrequencyUpsellOptionsDefaults = {
    title: "Before we process your donation...",
    paragraph: "Would you like to make it an annual gift?",
    yesButton: "YES! Process my gift as an annual gift of ${current_amount}",
    noButton: "NO! Process my gift as a one-time gift of ${upsell_amount}",
    upsellFrequency: "annual",
    upsellFromFrequency: ["onetime"],
    customClass: "",
    upsellAmount: (currentAmount) => currentAmount,
    onAccept: () => { },
    onDecline: () => { },
};
