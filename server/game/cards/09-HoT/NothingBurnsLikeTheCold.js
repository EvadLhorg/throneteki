import PlotCard from '../../plotcard.js';
import Messages from '../../Messages/index.js';
import { flatMap } from '../../../Array.js';

class NothingBurnsLikeTheCold extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                subTargets: {
                    attachment: {
                        ifAble: true,
                        activePromptTitle: 'Select an attachment',
                        cardCondition: (card, context) =>
                            card.location === 'play area' &&
                            card.controller === context.choosingPlayer &&
                            card.getType() === 'attachment',
                        gameAction: 'discard'
                    },
                    location: {
                        ifAble: true,
                        activePromptTitle: 'Select a location',
                        cardCondition: (card, context) =>
                            card.location === 'play area' &&
                            card.controller === context.choosingPlayer &&
                            card.getType() === 'location' &&
                            !card.isLimited(),
                        gameAction: 'discard'
                    }
                },
                messages: Messages.eachPlayerTargeting
            },
            handler: (context) => {
                let cards = flatMap(
                    context.targets.selections,
                    (selection) => selection.value
                ).filter((card) => !!card);
                this.game.discardFromPlay(cards, { allowSave: false });
            }
        });
    }
}

NothingBurnsLikeTheCold.code = '09052';

export default NothingBurnsLikeTheCold;
