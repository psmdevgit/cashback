import Select from "react-select";
import { useEffect, useState } from "react";
import API from "../axios";

const VoucherDropdown = ({ setVoucher }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await API.get("/suspense-active");

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
    <div className="col-md-4">
      <label>Voucher No</label>

      <Select
        options={options}
        onChange={(selected) => setVoucher(selected.value)}
        placeholder="🔍 Search Voucher..."
        isSearchable
      />
    </div>
  );
};

export default VoucherDropdown;