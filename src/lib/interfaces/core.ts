import type { DirectiveBinding, ObjectDirective } from 'vue'
import type { Placement } from '@floating-ui/dom'

export interface TooltipOptions {
  zIndex?: number
  trigger?: 'hover' | 'click'
  disabled?: boolean
  duration?: number
  offset?: [number, number]
  content?: string
  effect?: 'dark' | 'light' | 'dark-light'
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
  _clickTooltipListener?: EventListener
  _clickOutsideListener?: EventListener
  _visible?: boolean
  _init?: (el: TooltipReferenceElement, binding: DirectiveBinding<TooltipBindingValue>) => void
  _cleanup?: () => void
  /** 跟踪鼠标是否在 reference 或 floating 元素上 */
  _isHovered?: boolean
  _autoHideTimer?: NodeJS.Timeout | null
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
