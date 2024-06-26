import PlotCard from '../../plotcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class ForTheWatch extends PlotCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ defendingPlayer: this.controller }) &&
                this.numOfChallengesInitiatedAgainst() <= 1,
            targetController: 'opponent',
            effect: ability.effects.cannotWinChallenge()
        });
    }

    numOfChallengesInitiatedAgainst() {
        return this.tracker.count({ defendingPlayer: this.controller });
    }
}

ForTheWatch.code = '02067';

export default ForTheWatch;
