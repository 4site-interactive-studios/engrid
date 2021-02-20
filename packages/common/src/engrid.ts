export abstract class ENGrid {
    private enForm: HTMLFormElement;
    constructor() {
        this.enForm = document.querySelector("form.en__component") as HTMLFormElement;
        if (!this.enForm) {
            throw new Error('Engaging Networks Form Not Found!');
        }
    }

    // Return any parameter from the URL
    getUrlParameter(name: string) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    // Return the field value from its name. It works on any field type.
    // Multiple values (from checkboxes or multi-select) are returned as single string
    // Separated by ,
    getFieldValue(name: string) {
        return (new FormData(this.enForm)).getAll(name).join(',');
    }

    // Set a value to any field. If it's a dropdown, radio or checkbox, it selects the proper option matching the value
    setFieldValue(name: string, value: unknown) {
        (document.getElementsByName(name) as NodeListOf<HTMLFormElement>).forEach((field) => {
            if ('type' in field) {
                switch (field.type) {
                    case 'select-one':
                    case 'select-multiple':
                        for (const option of field.options) {
                            if (option.value == value) {
                                option.selected = true;
                            }
                        }
                        break;
                    case 'checkbox':
                    case 'radio':
                        // @TODO: Try to trigger the onChange event
                        if (field.value == value) {
                            field.checked = true;
                        }
                        break;
                    case 'textarea':
                    case 'text':
                    default:
                        field.value = value;
                }
                this.enParseDependencies();
            }
        })
        return;
    }

    // Trigger EN Dependencies
    enParseDependencies() {
        if (window.EngagingNetworks && typeof window.EngagingNetworks?.require?._defined?.enDependencies?.dependencies?.parseDependencies === "function") {
            window.EngagingNetworks.require._defined.enDependencies.dependencies.parseDependencies(window.EngagingNetworks.dependencies);
        }
    }

    // Return the current page ID
    getPageID() {
        if ('pageJson' in window) return window.pageJson.campaignPageId;
        return 0;
    }

    // Set body engrid data attributes
    setBodyData(dataName: string, value: string) {
        const body = <HTMLBodyElement>document.querySelector('body');
        body.setAttribute(`data-engrid-${dataName}`, value);
    }

    // Get body engrid data attributes
    getBodyData(dataName: string) {
        const body = <HTMLBodyElement>document.querySelector('body');
        return body.getAttribute(`data-engrid-${dataName}`);
    }
}