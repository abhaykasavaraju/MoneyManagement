App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  contractInstance: null,

  init: async () => {
    await App.initWeb3()
    await App.initContracts()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  initWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  initContracts: async () => {
    const contract = await $.getJSON('MoneyManagement.json')
    App.contracts.MoneyManagement = TruffleContract(contract)
    App.contracts.MoneyManagement.setProvider(App.web3Provider)
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
    $('#account').html(App.account)


    
    // Load smart contract
    const contract = await App.contracts.MoneyManagement.deployed()
    App.contractInstance = contract
    App.setLoading(false)
  },
  display: async()=>
  {
      var i=await App.contractInstance.getNamesLength();
      var j;
      for(j=1;j<=i;j++)
      {
          document.getElementById("para").innerHTML=document.getElementById("para").innerHTML+" "+await App.contractInstance.getNames(j)+" "+await App.contractInstance.getAddress(j)+" "+await App.contractInstance.getPercentage(j)+"<br>";
      }
  },
//on submission of form of add account
  set: async () => {
    App.setLoading(true)
//Adding account
    const newacc= $('#acc').val()
    const newname=$('#name').val()
    const newper=$('#per').val()

    await App.contractInstance.addAccount(newacc,newname,newper)
    window.alert('Value updated! Go to home page to see the details of the new account.')
  },
  //on submission of editName
  editName: async() =>{
    App.setLoading(true)
    //get id of old name
    const preName=$('#preName').val()
     //get id of old name
    const newName=$('#newName').val()
    await App.contractInstance.editName(preName,newName)
    window.alert('Value updated! GO to home page to see the new name ')
  },
  editPer: async() =>{
    App.setLoading(true)
    //get id of  name
    const perName=$('#name').val()
     //get id of percentage
    const per=$('#per').val()
    await App.contractInstance.editPercentage(perName,per)
    window.alert('Value updated! GO to home page to see the new percentage')
  },
  delete: async() =>
  {
    App.setLoading(true)
    const delname=$('#delname').val()
    await App.contractInstance.deleteAccount(delname)
    window.alert('Account Deleted! Go to home page to see the present accounts.')
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.init()
  })
})
