const DrawCard = require('../../drawcard.js');
const Message = require('../../Message');

class SamwellTarly extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isParticipating() && this.satisfiableBonuses().length > 0
            },
            handler: () => {
                let bonuses = this.satisfiableBonuses();
                if(bonuses.includes('stand')) {
                    this.game.promptForSelect(this.controller, {
                        cardCondition: card => this.canStandCharacter(card),
                        onSelect: (player, card) => this.activateBonuses(bonuses, card),
                        onCancel: () => this.activateBonuses(bonuses, null),
                        source: this
                    });
                    return;
                }

                this.activateBonuses(bonuses, null);
            }
        });
    }

    canStandCharacter(card) {
        return card !== this && card.location === 'play area' && card.getType() === 'character' && card.getTraits().some(trait => this.hasTrait(trait) && card.kneeled);
    }

    satisfiableBonuses() {
        let reserve = this.controller.getTotalReserve();
        let satisfiable = [];
        if(reserve >= 6 && this.controller.canDraw()) {
            satisfiable.push('draw');
        }
        if(reserve >= 8 && this.controller.canGainFactionPower()) {
            satisfiable.push('power');
        }
        if(reserve >= 10 && this.game.anyCardsInPlay(card => this.canStandCharacter(card))) {
            satisfiable.push('stand');
        }
        return satisfiable;
    }

    activateBonuses(bonuses, otherCharacter) {
        let bonusMessages = [];

        if(bonuses.includes('draw')) {
            this.controller.drawCardsToHand(1);
            bonusMessages.push('draw 1 card');
        }

        if(bonuses.includes('power')) {
            this.game.addPower(this.controller, 1);
            bonusMessages.push('gain 1 power for their faction');
        }

        if(bonuses.includes('stand') && otherCharacter) {
            this.controller.standCard(otherCharacter);
            bonusMessages.push(Message.fragment('stand {card}', { card: otherCharacter }));
        }

        this.game.addMessage('{0} uses {1} to {2}', this.controller, this, bonusMessages);
        return true;
    }
}

SamwellTarly.code = '22013';

module.exports = SamwellTarly;
