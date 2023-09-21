import { EngridLogger } from "./logger";
export class ShowIfPresent {
    constructor() {
        this.logger = new EngridLogger("ShowIfPresent", "yellow", "black", "👀");
        this.elements = [];
        if (this.shouldRun()) {
            this.run();
        }
    }
    shouldRun() {
        //Check if we have any elements on the page that match the pattern for this functionality
        //e.g. engrid__supporterquestions{id}-present or engrid__supporterquestions{id}-absent
        this.elements = [
            ...document.querySelectorAll('[class*="engrid__supporterquestions"]'),
        ].filter((el) => {
            const classNames = el.className.split(" ");
            return classNames.some((className) => /^engrid__supporterquestions.*-(present|absent)$/.test(className));
        });
        return this.elements.length > 0;
    }
    run() {
        const actions = [];
        //Create an array of actions for each element we have
        this.elements.forEach((el) => {
            //mapping to an object with the class name, field name, and type
            const classNames = el.className.split(" ");
            const matchingClass = classNames.find((className) => /^engrid__supporterquestions.*-(present|absent)$/.test(className));
            if (!matchingClass)
                return null;
            const hyphenIndex = matchingClass.indexOf("-");
            const fieldId = matchingClass.substring(26, hyphenIndex);
            const type = matchingClass.substring(hyphenIndex + 1);
            actions.push({
                class: matchingClass,
                fieldName: "supporter.questions." + fieldId,
                type: type,
            });
        });
        //Process the actions
        actions.forEach((action) => {
            if (!action)
                return;
            const input = document.getElementsByName(action.fieldName)[0];
            const elements = document.querySelectorAll(`.${action.class}`);
            // If we don't have the input and we have a "-present" element, hide it
            if (!input && action.type === "present") {
                this.logger.log(`${action.fieldName} NOT FOUND, hiding elements with class ${action.class}`);
                elements.forEach((el) => {
                    el.style.display = "none";
                });
            }
            // If we do have the input and we have a "-absent" element, hide it.
            if (input && action.type === "absent") {
                this.logger.log(`${action.fieldName} FOUND, hiding elements with class ${action.class}`);
                elements.forEach((el) => {
                    el.style.display = "none";
                });
            }
        });
    }
}
