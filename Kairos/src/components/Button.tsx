
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
  style?: any
  disabled?: boolean
}

import './Button.css'

export default function Button({ onClick, children, className = '', style = {}, disabled = false }: ButtonProps) {
  return (
    <view
      className={`button ${className} ${disabled ? 'button-disabled' : ''}`}
      style={style}
      bindtap={disabled ? undefined : onClick}
    >
      <text className="button-text">{children}</text>
    </view>
  )
}