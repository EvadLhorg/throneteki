const DrawCard = require('../../drawcard.js');

class Sellsails extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Smuggler or Warship',
            cost: ability.costs.discardGold(),
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: card => card.location === 'play area' && card.kneeled &&
                                       (card.hasTrait('Smuggler') || card.hasTrait('Warship')),
                gameAction: 'stand'
            },
            handler: context => {
                context.target.controller.standCard(context.target);
                this.game.addMessage('{0} discards 1 gold from {1} to stand {2}', context.player, this, context.target);
            }
        });
    }
}

Sellsails.code = '20002';

module.exports = Sellsails;
