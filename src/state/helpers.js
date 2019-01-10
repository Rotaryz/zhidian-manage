import {mapState, mapGetters, mapActions} from 'vuex'

export const globalComputed = {
  ...mapState('global', {
    currentTitles: (state) => state.currentTitles,
    marginBottom: (state) => state.marginBottom,
  }),
  ...mapGetters('global', []) // todo
}
export const globalMethods = {
  ...mapActions('global', []) // todo
}
