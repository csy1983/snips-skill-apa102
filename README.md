# snips-skill-apa102

####  Snips skill for the respeaker 4 mics array hat apa 102 leds.

![Demo](./demo.gif)

*idle -> listening -> thinking -> idle*

## Setup

### Using [Sam](https://docs.snips.ai/ressources/sam_reference)

```sh
sam install action -g https://github.com/elbywan/snips-skill-apa102
sam service restart snips-skill-server
```

### Manual installation

```sh
# Go to the snips skills folder
cd /var/lib/snips/skills/
# Clone from the repository
git clone https://github.com/elbywan/snips-skill-apa102
# Restart the skill server
sudo systemctl restart snips-skill-server
```