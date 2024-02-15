import { useEffect } from "react";
import "./PaymentSucess.css";
import useAuth from "../../../hooks/useAuth";
import UserService from "../../../service/UserService";
const PaymentSucess = () => {
  const { user, setUser } = useAuth();
  const getCurrentBalance = async () => {
    const balanceResponse = await UserService.getCurrentUserBalance();
    if (balanceResponse.status !== 400) {
      localStorage.setItem("balance", balanceResponse.balance);
      setUser({ ...user, balance: balanceResponse.balance });
    }
  };
  useEffect(() => {
    getCurrentBalance();

    // Create a Broadcast Channel
    const channel = new BroadcastChannel("refresh-tabs");

    // Send a message to all other tabs
    channel.postMessage("refresh");

    // Cleanup: close the channel when the component unmounts
    return () => channel.close();
  }, []);
  return (
    <>
      <div className="payment">
        <div class="card">
          <div className="checkmark-div">
            <i class="checkmark">✓</i>
          </div>
          <h1>Nạp tiền thành công</h1>
          <p>
            Bạn đã nạp tiền thành công vào tài khoản của bạn
            <br /> Bạn có thể tắt tab này
          </p>
        </div>
      </div>
    </>
  );
};
export default PaymentSucess;
