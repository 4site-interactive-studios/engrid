# ENgrid Documentation Writing Instructions

## File Structure and Location

- **File naming**: Use lowercase with hyphens (kebab-case), e.g., frequency-upsell.md, custom-lightboxes.md
- **Format**: Markdown (`.md`) files
- **Working area**: The documentation you create should be placed in `reference-materials/docs/generated`
- **Work stack**: All typescript files in `packages/scripts/src/` that do not have a `Docs: <link>` in the javadoc at the start of the file. 
  * Interfaces in `packages/scripts/src/interfaces` should be used to aid you in writing documentation for the files that import them, they do not need documentation themselves
  * Events in `packages/scripts/src/events` should be used to aid you in writing documentation for the files that import them, they do not need documentation themselves
  * Exclusions: app.ts
  * Special cases: engrid.ts should be referred to as "ENGrid Core Functions"

## Frontmatter (Required)

Every documentation file MUST start with frontmatter containing exactly two fields:

```
---
title: Page Title
description: Brief description of what this page covers
---
```

**Examples:**
- `title: Custom Lightboxes`
- `description: This page shows how to use ENgrid's abstract Modal component to create your own lightbox component`

## Content Structure

### Headings Hierarchy
- Use `##` for main sections
- Use `###` for subsections
- Use `####` sparingly for minor subsections
- First line after frontmatter should be either a `##` heading or introductory paragraph

### Section Organization
Typical structure patterns include:
1. **Overview/Introduction**: Brief explanation of the feature
2. **Implementation/Setup**: How to use or configure
3. **Configuration Options**: Detailed options (often in tables)
4. **Examples**: Practical code examples
5. **Additional Notes**: Edge cases, warnings, tips

## Special Components

### Callouts
Use callouts to highlight important information:

```markdown
{% callout title="[Title]" %}
[Content here]
{% /callout %}
```

**Common callout titles:**
- `"You should know!"` - Important information about behavior or limitations
- `"Information"` - General informational notes
- `"Tip"` - Helpful tips for implementation
- `"Example Text"` - Sample text content
- `"Warning"` - Cautionary information

**Example:**
```markdown
{% callout title="You should know!" %}
These classes can also be used on thank you pages
{% /callout %}
```

## Code Examples

### Code Blocks
Use triple backticks with language identifiers:

````markdown
```html
<!-- HTML code here -->
```

```javascript
// JavaScript code here
```

```typescript
// TypeScript code here
```

```css
/* CSS code here */
```
````

### Code Block Best Practices
- Always specify the language for syntax highlighting
- Include comments to explain complex parts
- For configuration objects, show all available options
- Include complete, working examples when possible
- Link to external code sources (like Pastebin) for full implementations

**Example:**
````markdown
```javascript
window.EngridFrequencyUpsell = {
  title: 'Before we process your donation...',
  paragraph: 'Would you like to make it an annual gift?',
  yesButton: 'YES! Process my gift as an annual gift of ${upsell_amount}',
  noButton: 'NO! Process my gift as a one-time gift of ${current_amount}',
}
```
````

## Tables

Use tables extensively for documenting:
- Helper classes and their descriptions
- Configuration options and their values
- Variables and their meanings

**Standard table format:**
```markdown
| Class/Property | Description | Additional Column (if needed) |
| -------------- | ----------- | ----------------------------- |
| `value`        | Explanation | Info                          |
```

**Common table patterns:**

1. **Helper Classes Table:**
```markdown
| Class           | Description                              | Usable on Thank You Pages |
| --------------- | ---------------------------------------- | ------------------------- |
| `i1-hide`       | Hides the entire 1st field               | Yes                       |
| `i1-hide-label` | Hides the 1st field's label              | Yes                       |
```

2. **Configuration Options Table:**
```markdown
| Property        | Description                                    |
| --------------- | ---------------------------------------------- |
| `title`         | Title of the modal                             |
| `paragraph`     | Sub-title text. Variables allowed              |
```

## Writing Style

### Tone and Voice
- **Second person**: Use "you" and "your" (e.g., "You can configure...")
- **Active voice**: "ENgrid provides..." not "ENgrid is provided with..."
- **Technical but clear**: Balance technical accuracy with readability
- **Instructive**: Focus on how to accomplish tasks

### Content Guidelines
1. **Start with context**: Explain what the feature does before diving into implementation
2. **Provide examples**: Show real-world usage scenarios
3. **Document defaults**: Always mention default values and behaviors
4. **Note limitations**: Call out any restrictions or edge cases
5. **Cross-reference**: Mention related features when relevant

### Common Phrases and Patterns
- "This page shows how to..."
- "To add [feature] to your page..."
- "Using ENgrid, you can..."
- "You need to..."
- "When [condition], [result]..."

## Specific Documentation Types

### Helper Classes Documentation
When documenting CSS helper classes:
- Use tables with columns: Class, Description, Usable on Thank You Pages
- Wrap class names in backticks
- Group related classes together under subheadings
- Include examples of HTML usage

### Component Configuration Documentation
When documenting component options:
1. Show basic implementation first
2. List all configuration options in a table or detailed list
3. Document default values
4. Provide complete examples
5. Show how to customize behavior

**Example structure:**
```markdown
## Adding [Component Name]

[Brief explanation]

```[language]
[Basic implementation code]
```

## Customizing [Component Name]

There are additional properties you can set to customize:

| Property | Description |
| -------- | ----------- |
| `prop1`  | Description |
| `prop2`  | Description |

## Default Values

The default values are:

```[language]
[Default configuration object]
```

## Example

[Practical example with explanation]
```

### TypeScript/Class Documentation
When documenting TypeScript classes or components:
1. Explain the abstract concept first
2. Show import statements
3. Demonstrate class extension
4. Document methods and their purpose
5. Show complete implementation example

## Links and References

- **External links**: Use standard markdown links `[link text](URL)`
- **Pastebin links**: Include links to full code examples on Pastebin when appropriate
- **Internal references**: Reference other documentation pages when relevant

**Example:**
```markdown
Processing Fee Checkbox Code Block: [https://pastebin.com/raw/7n4k0kPM](https://pastebin.com/raw/7n4k0kPM)
```

## Lists

Use both ordered and unordered lists appropriately:
- **Unordered lists** for non-sequential items, features, or options
- **Ordered lists** for step-by-step instructions
- Use proper indentation for nested lists

**Example:**
```markdown
To activate the Welcome Back component, you need to:

- Add the class `fast-personal-details` to the form block
- Use the helper classes `hideif-fast-personal-details` and `showif-fast-personal-details`
- Ensure all mandatory fields are present
```

## Variables and Placeholders

When documenting variables or placeholders:
- Wrap them in backticks
- Explain what they represent
- Show them in context

**Example:**
```markdown
The `{current_amount}` and `{upsell_amount}` placeholders will be replaced with the current amount and the upsell amount, respectively.
```

## HTML Examples

When showing HTML markup:
- Include complete, valid HTML snippets
- Add comments to explain non-obvious parts
- Show the full class structure for pseudo-EN fields
- Demonstrate proper integration with Engaging Networks

## Formatting Details

- **Inline code**: Use single backticks for class names, property names, file paths, and code snippets
- **Bold**: Rarely used, mainly for emphasis in callouts or lists
- **Horizontal rules**: Use `---` to separate major sections when appropriate
- **Line breaks**: Use appropriate spacing between sections for readability

## Quality Checklist

Before considering documentation complete, verify:
- [ ] Frontmatter includes both title and description
- [ ] All code blocks have language identifiers
- [ ] Tables are properly formatted with aligned columns
- [ ] Examples are complete and functional
- [ ] Callouts are properly opened and closed
- [ ] Default values are documented
- [ ] Edge cases and limitations are noted
- [ ] Cross-references to related features are included
- [ ] Writing style is consistent with existing docs

---

These instructions ensure consistency across all ENgrid documentation components. Follow these guidelines precisely to maintain the established documentation standards.

## Understanding and Flagging for Review

As an AI agent generating documentation, you must ensure clarity and accuracy. When encountering any of the following situations, flag them for human review:

### When to Flag

Use the notation `TODO: <Reason for flagging>` in the generated documentation when you encounter:

1. **Ambiguous Code Behavior**: When the TypeScript code's behavior or purpose is not immediately clear from the code itself or comments
   ```markdown
   TODO: The interaction between this method and the DOM is unclear - needs verification
   ```

2. **Missing Context**: When you cannot determine the full context of how a feature is used or configured
   ```markdown
   TODO: Unable to determine all configuration options - source code may be incomplete
   ```

3. **Conflicting Information**: When code comments, variable names, or implementation suggest different purposes
   ```markdown
   TODO: Code comment suggests X but implementation appears to do Y - needs clarification
   ```

4. **Dependencies or Integrations**: When external dependencies or Engaging Networks platform specifics affect functionality in ways you cannot verify
   ```markdown
   TODO: Interaction with EN platform API requires verification
   ```

5. **Edge Cases**: When you identify potential edge cases but cannot confirm the expected behavior
   ```markdown
   TODO: Behavior when field is empty/null needs confirmation
   ```

6. **TypeScript Type Complexity**: When complex TypeScript types or generics make the actual runtime behavior unclear
   ```markdown
   TODO: Generic type constraints may affect available methods - needs verification
   ```

7. **Incomplete Documentation**: When the source code lacks sufficient comments or context to document all features comprehensively
   ```markdown
   TODO: No JSDoc comments available - full functionality may not be documented
   ```

### Flagging Format

Place flags as callouts in the documentation where the unclear item appears:

```markdown
TODO: The default behavior when no configuration is provided is unclear from the source code - needs verification
```

Or as inline comments in code blocks:

```typescript
// TODO: Verify if this parameter accepts null values
const result = someFunction(value);
```

### Confidence Levels

When generating documentation, be honest about uncertainty:

- **High Confidence**: Code is clear, well-commented, and follows obvious patterns
- **Medium Confidence**: Code is understandable but lacks some context or documentation
- **Low Confidence**: Code behavior is unclear or conflicts with apparent intent - FLAG FOR REVIEW

If your confidence is medium or low for any significant aspect of the documentation, add a flag.

---

These instructions ensure consistency across all ENgrid documentation components. Follow these guidelines precisely to maintain the established documentation standards.