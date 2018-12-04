// @flow

import Vue from 'vue'
import addSlots from './add-slots'
import createInterceptPlugin from './create-intercept-plugin'
import addProvide from './add-provide'
import { stubComponents } from './stub-components'
import { throwError } from './util'
import { componentHasProperty } from './validators'
import { cloneDeep } from 'lodash'

export default function createConstructor (component: Component, options: Options): Component {
  const vue = options.localVue || Vue

  if (options.context) {
    if (!componentHasProperty(component, 'functional')) {
      throwError('mount.context can only be used when mounting a functional component')
    }

    if (typeof options.context !== 'object') {
      throwError('mount.context must be an object')
    }
    const clonedComponent = cloneDeep(component)
    component = {
      render (h) {
        return h(clonedComponent, options.context, options.children)
      }
    }
  }

  if (options.provide) {
    addProvide(component, options)
  }

  if (options.stubs) {
    stubComponents(component, options.stubs)
  }

  const Constructor = vue.extend(component)

  if (options.intercept) {
    // creates a plugin that adds properties, and then install on local Constructor
    // this does not affect the base Vue class
    const interceptPlugin = createInterceptPlugin(options.intercept)
    Constructor.use(interceptPlugin)
  }

  const vm = new Constructor(options)

  if (options.slots) {
    addSlots(vm, options.slots)
  }

  return vm
}
