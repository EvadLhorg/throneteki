const DrawCard = require('../../drawcard.js');

class TheIronFleet extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'marshal',
                amount: 1,
                match: card => card.hasTrait('Raider')
            })
        });
        
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.attackingPlayer === this.controller && this.hasAttackingRaider()
            },
            handler: (context) => {
                this.game.addMessage('{0} uses {1} to discard the top card from each opponent\'s deck', context.player, this);
                for(let opponent of this.game.getOpponents(context.player)) {
                    opponent.discardFromDraw(1);
                }
            }
        });
    }

    hasAttackingRaider() {
        return this.controller.anyCardsInPlay(card => card.isAttacking() && card.hasTrait('Raider') && card.getType() === 'character');
    }
}

TheIronFleet.code = '21004';

module.exports = TheIronFleet;