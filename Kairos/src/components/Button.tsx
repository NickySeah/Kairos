interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
  style?: any
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
}

import './Button.css'

/**
 * Reusable Button component for the calendar app
 * Supports different variants and disabled state
 */
export default function Button({ 
  onClick, 
  children, 
  className = '', 
  style = {}, 
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <view
      className={`button button-${variant} ${className} ${disabled ? 'button-disabled' : ''}`}
      style={style}
      bindtap={disabled ? undefined : onClick}
    >
      <text className="button-text">{children}</text>
    </view>
  )
}