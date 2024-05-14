import type { DirectiveBinding } from 'vue'

export interface TooltipBindingValue {
  content?: string
}

export interface TooltipReferenceElement extends HTMLElement {
  _tooltipEl?: HTMLElement
  _tooltipArrowEl?: HTMLElement | null
  _showTooltipListener?: EventListener
  _hideTooltipListener?: EventListener
  _init?: (el: TooltipReferenceElement, binding: DirectiveBinding<TooltipBindingValue>) => void
}
