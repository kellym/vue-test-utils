import { compileToFunctions } from 'vue-template-compiler'
import { isVueComponent, componentHasProperty } from '../../../../src/lib/validators'
import Component from '~resources/components/component.vue'
import ComponentWithoutName from '~resources/components/component-without-name.vue'
import ComponentWithExtends from '~resources/components/component-with-extends.vue'

describe('isVueComponent', () => {
  it('returns true using a named .vue file', () => {
    expect(isVueComponent(Component)).to.equal(true)
  })

  it('returns true using an unnamed .vue file', () => {
    expect(isVueComponent(ComponentWithoutName)).to.equal(true)
  })

  it('returns true using a compiled vue template', () => {
    const Compiled = compileToFunctions('<div><p></p><p></p></div>')
    expect(isVueComponent(Compiled)).to.equal(true)
  })
})

describe('componentHasProperty', () => {
  it('returns true if the component has the property', () => {
    expect(componentHasProperty(Component, 'name')).to.equal(true)
  })

  it('returns false if the component does not have the property', () => {
    expect(componentHasProperty(Component, 'pants')).to.equal(false)
  })

  it('returns true if the component extends a component with the property', () => {
    expect(componentHasProperty(ComponentWithExtends, 'name')).to.equal(true)
  })
})
