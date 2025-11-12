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

## Component: In detail

- Selectable node with bubble menu on selected state
- When selected it should change the view in the NodeDetail view which is a fixed sidebar, sharing state via Context
- That detail view needs: Build (settings for the node), Status (logs of stuff/error etc)
- Will add react-flow later


## Considerations
