import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HarlawScout extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                'onCardDiscarded:aggregate': (event) =>
                    event.events.some(
                        (discardEvent) =>
                            discardEvent.source === 'reserve' &&
                            discardEvent.cardStateWhenDiscarded.controller !== this.controller
                    )
            },
            limit: ability.limit.perRound(2),
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

HarlawScout.code = '24005';

export default HarlawScout;
