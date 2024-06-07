import type { DirectiveBinding, ObjectDirective } from 'vue'
import type { Placement } from '@floating-ui/dom'

export interface TooltipOptions {
  content?: string
  effect?: 'dark' | 'light'
  placement?: Placement
  appendTo?: HTMLElement | string
  arrowWidth?: number
  showArrow?: boolean
}

export type TooltipBindingValue = string | TooltipOptions | undefined

export interface TooltipReferenceElement extends HTMLElement {
  _tooltipEl?: HTMLElement
  _tooltipArrowEl?: HTMLElement | null
  _showTooltipListener?: EventListener
  _hideTooltipListener?: EventListener
  _init?: (el: TooltipReferenceElement, binding: DirectiveBinding<TooltipBindingValue>) => void
  _cleanup?: () => void
}

export type UpdatePositionFn = (
  ref: HTMLElement,
  tooltip: HTMLElement,
  opts?: {
    arrowElement?: HTMLElement | null
    bindingValue?: TooltipBindingValue
  }
) => void

export type ShowTooltipFn = UpdatePositionFn

export type AutotooltipDirective = ObjectDirective<TooltipReferenceElement, TooltipBindingValue>
