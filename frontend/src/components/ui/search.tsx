import { Search as SearchIcon } from 'lucide-react'
import { Input } from './input'

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
}

export function Search({ onSearch, className, ...props }: SearchProps) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className={`pl-8 ${className}`}
        onChange={(e) => onSearch?.(e.target.value)}
        {...props}
      />
    </div>
  )
} 