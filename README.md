# n8n Design Engineer Exercise

This repo contains the work for [this](https://n8n.notion.site/Design-Engineer-take-home-assignment-2965b6e0c94f8078bf3de5f5263e7280) design engineering challenge.

To view the node component directly, go [here](/components/node/index.tsx)

## Getting setup

You can view a working version here:

If you want to run this locally, then clone the repo and run:

```bash
nvm install
yarn
yarn dev
```

## Background

The goal is to reimagine the next version of the 'node' component. Build a working prototype that includes existing functionality such as:

- Main information (icon, label, etc.)
- Multiple states with clear visual feedback (e.g., success, waiting, error…)
- Quick actions (e.g., play, deactivate, delete)
- Node actions menu (right-click or button-triggered)

## Challenges

Reviewing the current implementation, there are a few key areas for improvement.

- The detail view to edit the node is a full dialog. Whilst this allows for showing a lot of information, it increases the cognitive weight of context switching. The delay in opening and closing the dialog, as well as the visual repainting makes the process feel slugish when jumping between nodes.
- Context menu animation is janky. Scaling across the size on the y axis feels un-natural and makes the menu appearance sluggish
- The quick actions above the node have no tooltip, making it difficult to know what they do
- Error messages don't offer any resolution to action

Whilst we have limited research to go on, I'll focus on these challenges first. They seem like easy problems to solve that could improve the overall performance and experience of working with the node.

## Our Solution

The goal is to reduce the friction when using the Node component. First by fixing the bugs and improving the UX based on the challenges above, then adding more delightful animations to key steps (e.g running a Node).

This implementation focuses on:

- **Side Panel**: Persistent panel reduces context switching overhead. Included smooth height transitions using `framer-motion` creating a smooth transition between states.
- **Context Menu**: Improve janky animation and fixed clipping bug. Relabeled some items as many were global actions not relevant to that specific node. Also used more casual language to make things feel friendlier.
- **Delightful animations**: Added nice pulsing state animations which creates a sense of action when the step is executing.
- **Clearer error validation**: Inline validation shows directly on the form and the node. Server validation shows in clear toast message.

I also kept focus navigation and key controls, including keyboard shortcuts, from the previous implementation.

### Technical Implementation

- Built with React, TypeScript, and Tailwind CSS
- Motion animations powered by `framer-motion`
- Form state management via `react-hook-form` + `zod`
- Keyboard shortcuts using `react-hotkeys-hook`
- Accessible primitives based on Radix UI patterns

## Considerations

A few patterns in here would need to be re-evaluated in production when working with 1000s of nodes, but for prototyping purposes we'll keep things simple.

Also, there are several things I added for prototype purposes (e.g react-flow) to get a better sense how this Node works in it's actual environment.

Using it this way gave me some ideas for further iteration:

- Adding notes/comments _on_ the node itself. If working collaborative it'd be good to leave comments on why the config was a certain way. Kinda like a Figma frame.
- Adding node types to 'drag' from a panel. It would make the whole experience more tactile if I could drag a node in or select it from a persistent panel rather than going through a multi step form. It'd lower the friction to trying out different nodes/configurations whilst experimenting.
- Editing _on_ the node itself. It'd be nicer if I could rename or swap the node by clicking on the title or icon respectively. Seems like more overhead to goto the form on the right to change things over on the node itself.
