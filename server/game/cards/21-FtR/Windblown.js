const DrawCard = require('../../drawcard');

class Windblown extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isParticipating()
            },
            cost: ability.costs.putSelfIntoShadows(),
            target: {
                cardCondition: card => 
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    (card.hasTrait('Army') || card.hasTrait('Mercenary')),
                gameAction: 'stand'
            },
            handler: context => {
                context.player.standCard(context.target);
                this.game.addMessage('{0} returns {1} to shadows to stand {2}', context.player, this, context.target);
            }
        });
    }
}

Windblown.code = '21011';

module.exports = Windblown;