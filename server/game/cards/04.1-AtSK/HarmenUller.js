import DrawCard from '../../drawcard.js';

class HarmenUller extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: (card) => card.hasTrait('Sand Snake'),
            effect: ability.effects.gainAmbush(-1)
        });
    }
}

HarmenUller.code = '04016';

export default HarmenUller;
