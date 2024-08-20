/**
 * This class contains the logic for special classes that can be used to hide elements if
 * certain supporter questions are present or absent.
 * Typically, this can be used to hide elements when an opt in question is not rendered on the page
 * because the supporter came from a campaign link and is already opted in, so EN doesn't render
 * the question on the page.
 *
 * The class names are of the format:
 * engrid__supporterquestions{id}-present -- show this element when the supporter question is present
 * engrid__supporterquestions{id}-absent -- show this element when the supporter question is absent
 *
 * The {id} is the id of the supporter question. This can be found by inspecting the element on the page.
 *
 * It's also possible to combine multiple questions using the following format. These examples show 2 questions,
 * but you can use as many as you like:
 * engrid__supporterquestions{id1}__supporterquestions{id2}-present -- show this element when EITHER question is present
 * engrid__supporterquestions{id1}__supporterquestions{id2}-absent -- show this element when EITHER question is absent
 */
import { EngridLogger } from "./logger";

export class ShowIfPresent {
  private logger: EngridLogger = new EngridLogger(
    "ShowIfPresent",
    "yellow",
    "black",
    "👀"
  );
  private elements: any[] = [];

  constructor() {
    if (this.shouldRun()) {
      this.run();
    }
  }

  private shouldRun() {
    // Check if we have any elements on the page that match the pattern for this functionality
    // e.g. engrid__supporterquestions{id}__supporterquestions{id}-present, etc.
    this.elements = [
      ...document.querySelectorAll('[class*="engrid__supporterquestions"]'),
    ].filter((el) => {
      const classNames = el.className.split(" ");
      return classNames.some((className) =>
        /^engrid__supporterquestions\d+(__supporterquestions\d+)*-(present|absent)$/.test(
          className
        )
      );
    });

    return this.elements.length > 0;
  }

  private run() {
    const actions: {
      fieldNames: string[];
      type: string;
      class: string;
    }[] = [];

    // Create an array of actions for each element we have
    this.elements.forEach((el) => {
      // Mapping to an object with the class name, field name(s), and type
      const classNames = el.className.split(" ");
      const matchingClass = classNames.find((className: string) =>
        /^engrid__supporterquestions\d+(__supporterquestions\d+)*-(present|absent)$/.test(
          className
        )
      );

      if (!matchingClass) return null;

      const typeIndex = matchingClass.lastIndexOf("-");
      const type = matchingClass.substring(typeIndex + 1);

      // Getting an array of the matching input names
      // e.g. engrid__supporterquestions12345-present => ['supporter.questions.12345']
      // e.g. engrid__supporterquestions12345__supporterquestions67890-present => ['supporter.questions.12345', 'supporter.questions.67890']
      const inputIds = matchingClass
        .substring(8, typeIndex)
        .split("__")
        .map((id: string) => `supporter.questions.${id.substring(18)}`);

      actions.push({
        class: matchingClass,
        fieldNames: inputIds,
        type: type,
      });
    });

    //Process the actions
    actions.forEach((action) => {
      const inputElements = action.fieldNames.map(
        (fieldName) => document.getElementsByName(fieldName)[0]
      );
      const elements: NodeListOf<HTMLElement> = document.querySelectorAll(
        `.${action.class}`
      );

      const areAllInputsPresent = inputElements.every((input) => !!input);
      const areAllInputsAbsent = inputElements.every((input) => !input);

      // Hide the elements based on AND conditions
      if (
        (action.type === "present" && areAllInputsAbsent) ||
        (action.type === "absent" && areAllInputsPresent)
      ) {
        this.logger.log(
          `Conditions not met, hiding elements with class ${action.class}`
        );
        elements.forEach((el) => {
          el.style.display = "none";
        });
      }
    });
  }
}
