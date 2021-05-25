let prevProfit = 0;

function init() {
  chrome.storage.local.get(
    {
      investment: '',
      ifee: '',
      initialprice: '',
      sellingprice: '',
      efee: '',
    },
    (data) => {
      document.getElementById('investment').value = data.investment;
      document.getElementById('ifee').value = data.ifee;
      document.getElementById('initialprice').value = data.initialprice;
      document.getElementById('sellingprice').value = data.sellingprice;
      document.getElementById('efee').value = data.efee;
      calculateProfit();
      listenforChanges();
    }
  );
}

function listenforChanges() {
  const inputs = ['investment', 'ifee', 'initialprice', 'sellingprice', 'efee'];
  inputs.forEach((name) => {
    const input = document.getElementById(name);
    input.addEventListener('input', () => {
      calculateProfit();
    });
  });
}

function calculateProfit() {
  const investment = document.getElementById('investment').value;
  const ifee = document.getElementById('ifee').value;
  const initialprice = document.getElementById('initialprice').value;
  const sellingprice = document.getElementById('sellingprice').value;
  const efee = document.getElementById('efee').value;

  chrome.storage.local.set({
    investment,
    ifee,
    initialprice,
    sellingprice,
    efee,
  });

  var totalifee = (investment * ifee) / 100;
  var totalreturn = ((investment - totalifee) / initialprice) * sellingprice;
  var totalefee = (totalreturn * efee) / 100;
  totalreturn = totalreturn - totalefee;
  var profitloss = totalreturn - investment || 0;
  var profitloss_string = profitloss.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const elProfitloss = document.getElementById('totalprofit');
  elProfitloss.innerText =
    profitloss >= 0 ? `+${profitloss_string}` : profitloss_string;
  const defaultclass = profitloss >= 0 ? 'success' : 'warn';
  let animation = '';
  if (
    (prevProfit <= 0 && profitloss >= 0) ||
    (prevProfit >= 0 && profitloss < 0)
  ) {
    if (profitloss > 0) {
      animation = 'bounce-up';
    } else if (profitloss < 0) {
      animation = 'bounce-down';
    }
    prevProfit = profitloss;
  }
  elProfitloss.classList = `${defaultclass} ${animation}`;
  elProfitloss.onanimationend = () => {
    elProfitloss.classList = defaultclass;
  };

  const elTotalifee = document.getElementById('totalifee');
  elTotalifee.innerText = (totalifee || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const elTotalefee = document.getElementById('totalefee');
  elTotalefee.innerText = (totalefee || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const elTotal = document.getElementById('total');
  elTotal.innerText = (totalreturn || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

init();
