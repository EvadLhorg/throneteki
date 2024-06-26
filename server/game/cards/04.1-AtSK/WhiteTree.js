import DrawCard from '../../drawcard.js';

class WhiteTree extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onIncomeCollected: (event) => event.player !== this.controller
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let otherPlayer = context.event.player;

                if (!otherPlayer) {
                    return;
                }

                this.game.transferGold({ from: otherPlayer, to: this.controller, amount: 1 });
                this.game.addMessage(
                    "{0} kneels {1} to move 1 gold from {2}'s gold pool to their own",
                    this.controller,
                    this,
                    otherPlayer
                );
            }
        });
    }
}

WhiteTree.code = '04007';

export default WhiteTree;
