import { Suspense, useEffect } from 'react'

import useRouteElements from './routes/index.js'
import Loading from './components/Loading/index.js'
import ScrollToTop from './components/ScrollToTop/ScrollToTop.js'
import usePayment from './hooks/usePayment.js'
function App () {
  const {setPaymentStatus} = usePayment()
  const routeElements = useRouteElements()
  useEffect(() => {
    const channel = new BroadcastChannel('refresh-tabs');

    channel.onmessage = (message) => {
      if (message.data === 'refresh') {
        // Refresh the current tab

        setPaymentStatus("Thanh toán thành công")
        
      }
    };

    // Cleanup
    return () => channel.close();
  }, []);
  return (
    <div className="App">
      <ScrollToTop/>
      <Suspense fallback={<Loading/>}>{routeElements}</Suspense>
    </div>

  )
}

export default App
