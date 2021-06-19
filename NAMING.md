# Naming Conventions for ENGrid

## CSS Custom Properties 
BEM Naming: https://en.bem.info/methodology/naming-convention/
- Names are written in lowercase Latin letters.
- Words are separated by a hyphen (-).
- The block name defines the namespace for its elements and modifiers.
- The element name is separated from the block name by a double underscore (__).
- The modifier name is separated from the block or element name by a single underscore (_).
- The modifier value is separated from the modifier name by a single underscore (_).
- For boolean modifiers, the value is not included in the name.
- Make the names of CSS Custom Properties as informative and clear as possible.
- Solve the problem of name collisions.
- Independently define CSS Custom Properties for elements and their optional elements.

Pattern: **block-name__elem-name_mod-name_mod-val**

- Block Name: The scoped namespace
- Element Name: The element being targeted
- Mod Name: The modification being performed
- Mod Value: The value of the modification

### Examples
**--engrid__page-alert_background-color**
- block-name: engrid
- elem-name: page-alert
- mod-name: background-color
- mod-val: Not applicable

**--h2_font-family**
- block-name: Not applicable
- elem-name: h2
- mod-name: font-fmaily
- mod-val: Not applicable

**--scale-down_20pct**
- block-name: Not applicable
- elem-name: Not applicable
- mod-name: Not applicable
- mod-val: scale-down-20pct