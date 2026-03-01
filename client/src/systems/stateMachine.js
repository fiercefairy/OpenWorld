import { STATES } from './movementState'
import { updateGrounded, transitionsGrounded } from './states/grounded'
import { updateAirborne, transitionsAirborne } from './states/airborne'
import { updateClimbing, transitionsClimbing } from './states/climbing'
import { updateGliding, transitionsGliding } from './states/gliding'
import { updateBalancing, transitionsBalancing } from './states/balancing'

const stateUpdaters = {
  [STATES.GROUNDED]: updateGrounded,
  [STATES.AIRBORNE]: updateAirborne,
  [STATES.CLIMBING]: updateClimbing,
  [STATES.GLIDING]: updateGliding,
  [STATES.BALANCING]: updateBalancing,
}

const stateTransitions = {
  [STATES.GROUNDED]: transitionsGrounded,
  [STATES.AIRBORNE]: transitionsAirborne,
  [STATES.CLIMBING]: transitionsClimbing,
  [STATES.GLIDING]: transitionsGliding,
  [STATES.BALANCING]: transitionsBalancing,
}

export function registerState(name, update, transitions) {
  stateUpdaters[name] = update
  stateTransitions[name] = transitions
}

export function updateStateMachine(state, delta, input) {
  const checkTransition = stateTransitions[state.currentState]
  if (checkTransition) {
    const next = checkTransition(state, input)
    if (next) {
      state.previousState = state.currentState
      state.currentState = next
      state.stateTimer = 0
    }
  }

  const updater = stateUpdaters[state.currentState]
  if (updater) {
    updater(state, delta, input)
  }

  state.stateTimer += delta
}
