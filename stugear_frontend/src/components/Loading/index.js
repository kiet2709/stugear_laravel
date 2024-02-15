import { CSpinner } from '@coreui/react'

const Loading = () => {
  return (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse">
        <CSpinner color="green" loading="true" />
      </div>
    </div>
  )
}

export default Loading
