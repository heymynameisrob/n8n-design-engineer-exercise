# 🔌 n8n Design Engineer Exercise

TLDR: View components [here](/tree/main/src/components/node)

### Challenge

The goal is to reimagine the the 'node' component, imagining what the next version of a workflow node could be.

Particularly focusing on the main blocks (label, icon etc) as well as the various running states (e.g running, success, error), whilst also including configuration and quick actions like Play/Deactivate/Delete.

[Read more](https://n8n.notion.site/Design-Engineer-take-home-assignment-2965b6e0c94f8078bf3de5f5263e7280)

### Revewing the existing node

The workflow node is a powerful primitive that forms the basis of an automated workflow. There are _lots_ of configurable options for users to pick from and experiment with. This complexity compounds the more nodes you add to the workflow.

Here are a few key areas for improvement

- The detail view to edit the node is a full dialog. Whilst this allows for showing a lot of information, it increases the cognitive weight of context switching. The delay in opening and closing the dialog, as well as the visual repainting makes the process feel slugish when jumping between nodes.
- Context menu animation is janky. Scaling across the size on the y axis feels un-natural and makes the menu appearance sluggish
- The quick actions above the node have no tooltip, making it difficult to know what they do
- Error messages are seperated to where the error occured

I found these issues the most burdensome when experiementing with nodes. I didn't get the sense my 'hands were free' to play and move around. This would be okay when I had exactly what I wanted in mind, essentially doing data entry, but when I wanted to get creative it felt like I had my hands tied. My inexperience with the platform has to be taken into account, but the extra abilities useful to 'power users' is exposed to early and can be overwhelming.

---

### Solution

I focused on addressing the above challenges first. I also kept focus navigation and key controls, including keyboard shortcuts, from the previous implementation. Additionally I also focused on a friendlier UX that made working with nodes less overwhemling. I did this by focusing on a few key areas:

- **Side Panel**: Persistent panel reduces context switching overhead. Included smooth height transitions using `framer-motion` creating a smooth transition between states.
- **Context Menu**: Improve janky animation and fixed clipping bug. Relabeled some items as many were global actions not relevant to that specific node. Also used more casual language to make things feel friendlier.
- **Delightful animations**: Added nice pulsing state animations which creates a sense of action when the step is executing.
- **Clearer error validation**: Inline validation shows directly on the form and the node. Server validation shows in clear toast message.

Aesthetically I experimented with a friendly tone and style. Visually this moves too far away from the brand direction but I think there are some softer elements we could adopt. Also choosing casual language (e.g Run instead of execute) makes the experience more accessible.

### Technical Implementation

- Built with React, TypeScript, and Tailwind CSS
- Motion animations powered by `framer-motion`
- Form state management via `react-hook-form` + `zod`
- Keyboard shortcuts using `react-hotkeys-hook`
- Accessible primitives based on Radix UI patterns

---

### Future Considerations

A few patterns in here would need to be re-evaluated in production when working with 1000s of nodes, but for prototyping purposes we'll keep things simple.

Also, there are several things I added for prototype purposes (e.g react-flow) to get a better sense how this Node works in it's actual environment.

Using it this way gave me some ideas for further iteration:

- Adding notes/comments _on_ the node itself. If working collaborative it'd be good to leave comments on why the config was a certain way. Kinda like a Figma frame.
- Adding node types to 'drag' from a panel. It would make the whole experience more tactile if I could drag a node in or select it from a persistent panel rather than going through a multi step form. It'd lower the friction to trying out different nodes/configurations whilst experimenting.
- Editing _on_ the node itself. It'd be nicer if I could rename or swap the node by clicking on the title or icon respectively. Seems like more overhead to goto the form on the right to change things over on the node itself.
