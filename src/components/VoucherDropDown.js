import Select from "react-select";
import { useEffect, useState } from "react";
import API from "../axios";

const VoucherDropdown = ({ setVoucher }) => {
  const [options, setOptions] = useState([]);
  
   const userBranch = localStorage.getItem("branch").trim(); 

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await API.get(`/suspense-active?branch=${userBranch}`);

      // Convert API data → dropdown format
      const formatted = res.data.map(item => ({
        value: item.VoucherNo,
        label: `${item.VoucherNo} (Bal: ${item.RemainingAmount})`
      }));

      setOptions(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="col-md-4 w-100">
      <label>Voucher No</label>

      <Select
        options={options}
        onChange={(selected) => setVoucher(selected.value)}
        placeholder="🔍 Search Voucher..."
        isSearchable
        className=""
      />
    </div>
  );
};

export default VoucherDropdown;