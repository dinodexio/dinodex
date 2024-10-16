import { Label } from "@radix-ui/react-label"

export const FILTER_NETWORK = [
    {
        key: 'mina',
        logo: '/images/token/mina-token.svg',
        name: 'Mina',
    },
    {
        key: 'ethereum',
        logo: '/images/token/eth-logo.svg',
        name: 'Ethereum',
    },
    {
        key: 'optimism',
        logo: '/images/token/op-token.svg',
        name: 'Optimism',
    },
    {
        key: 'polygon',
        logo: '/images/token/polygon-token.svg',
        name: 'Polygon',
    },
    {
        key: 'zksync',
        logo: '/images/token/zksync-token.svg',
        name: 'Zksync',
    }
]

export const FILTER_VOL = [
    {
        key: '1h',
        label: '1H volume'
    },
    {
        key: '1d',
        label: '1D volume'
    },
    {
        key: '1w',
        label: '1W volume'
    },
    {
        key: '1m',
        label: '1M volume'
    },
    {
        key: '1y',
        label: '1Y volume'
    }
]

export const DATA_TOKENS = [
    {
        id: 1,
        logo: 'images/swap/logo-token-default.svg',
        name: 'ethereum',
        slug: 'ethereum',
        symbol: 'ETH',
        price: 1000,
        change1h: '0.1',
        fdv: 7100000000,
        volume: 300000000,
    },
    {
        id: 2,
        logo: 'images/swap/logo-token-default.svg',
        name: 'bitcoin',
        slug: 'bitcoin',
        symbol: 'BTC',
        price: 1000,
        change1h: '0.1',
        change1d: '-0.2',
        fdv: 7100000000,
        volume: 300000000,
    },
    {
        id: 3,
        logo: 'images/swap/logo-token-default.svg',
        name: 'wrapped bitcoin',
        slug: 'wrapped-bitcoin',
        symbol: 'WBTC',
        price: 1000,
        change1h: '0.1',
        fdv: 7100000000,
        volume: 300000000,
    },
    {
        id: 4,
        logo: 'images/swap/logo-token-default.svg',
        name: 'Ton coin',
        slug: 'ton-coin',
        symbol: 'TON',
        price: 1000,
        change1h: '0.1',
        change1d: '-0.2',
        fdv: 7100000000,
        volume: 300000000,
    }, {
        id: 5,
        logo: 'images/swap/logo-token-default.svg',
        name: 'Worldcoin',
        slug: 'worldcoin',
        symbol: 'WLD',
        price: 1000,
        change1d: '-0.2',
        fdv: 7100000000,
        volume: 300000000,
    }
    , {
        id: 6,
        logo: 'images/swap/logo-token-default.svg',
        name: 'Aave',
        symbol: 'AAVE',
        slug: 'aave',
        price: 1000,
        fdv: 7100000000,
        volume: 300000000,
    }
    , {
        id: 7,
        logo: 'images/swap/logo-token-default.svg',
        name: 'Solana',
        slug: 'solana',
        symbol: 'SOL',
        price: 1000,
        change1h: '0.1',
        change1d: '-0.2',
        fdv: 7100000000,
        volume: 300000000,
    }
]

export const DATA_POOL = [
    {
        id: 1,
        tokenselected: {
            first: {
                logo: 'images/swap/logo-token-default.svg',
                name: 'ethereum',
                symbol: 'ETH'
            },
            second: {
                logo: 'images/swap/logo-token-dummy.svg',
                name: 'Wrapped Bitcoin',
                symbol: 'WBTC'
            }
        },
        feeTier: 0.03,
        tvl: 193000000,
        apr: 1.23,
        volume1d: 123456,
        volume7d: 500000000,
    },
    {
        id: 2,
        tokenselected: {
            first: {
                logo: 'images/swap/logo-token-default.svg',
                name: 'ethereum',
                symbol: 'ETH'
            },
            second: {
                logo: 'images/swap/logo-token-dummy.svg',
                name: 'Wrapped Bitcoin',
                symbol: 'WBTC'
            }
        },
        feeTier: 0.03,
        tvl: 193000000,
        apr: 1.23,
        volume1d: 123456,
        volume7d: 500000000,
    },
    {
        id: 3,
        tokenselected: {
            first: {
                logo: 'images/swap/logo-token-default.svg',
                name: 'ethereum',
                symbol: 'ETH'
            },
            second: {
                logo: 'images/swap/logo-token-dummy.svg',
                name: 'Wrapped Bitcoin',
                symbol: 'WBTC'
            }
        },
        feeTier: 0.03,
        tvl: 193000000,
        apr: 1.23,
        volume1d: 123456,
        volume7d: 500000000,
    },
    {
        id: 4,
        tokenselected: {
            first: {
                logo: 'images/swap/logo-token-default.svg',
                name: 'ethereum',
                symbol: 'ETH'
            },
            second: {
                logo: 'images/swap/logo-token-dummy.svg',
                name: 'Wrapped Bitcoin',
                symbol: 'WBTC'
            }
        },
        feeTier: 0.03,
        tvl: 193000000,
        apr: 1.23,
        volume1d: 123456,
        volume7d: 500000000,
    },
    {
        id: 5,
        tokenselected: {
            first: {
                logo: 'images/swap/logo-token-default.svg',
                name: 'ethereum',
                symbol: 'ETH'
            },
            second: {
                logo: 'images/swap/logo-token-dummy.svg',
                name: 'Wrapped Bitcoin',
                symbol: 'WBTC'
            }
        },
        feeTier: 0.03,
        tvl: 193000000,
        apr: 1.23,
        volume1d: 123456,
        volume7d: 500000000,
    },
    {
        id: 6,
        tokenselected: {
            first: {
                logo: 'images/swap/logo-token-default.svg',
                name: 'ethereum',
                symbol: 'ETH'
            },
            second: {
                logo: 'images/swap/logo-token-dummy.svg',
                name: 'Wrapped Bitcoin',
                symbol: 'WBTC'
            }
        },
        feeTier: 0.03,
        tvl: 193000000,
        apr: 1.23,
        volume1d: 123456,
        volume7d: 500000000,
    },
    {
        id: 7,
        tokenselected: {
            first: {
                logo: 'images/swap/logo-token-default.svg',
                name: 'ethereum',
                symbol: 'ETH'
            },
            second: {
                logo: 'images/swap/logo-token-dummy.svg',
                name: 'Wrapped Bitcoin',
                symbol: 'WBTC'
            }
        },
        feeTier: 0.03,
        tvl: 193000000,
        apr: 1.23,
        volume1d: 123456,
        volume7d: 500000000,
    }
]

export const DATA_TRANSACTIONS = [
    {
        hash: '15148928342688301073686450831186262760651520957763969021241498133203254721880',
        methodId: '303349388452548671409601861237238963847479248299791980945921844138025566202',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '4',
        signature_r: '15825324924619926963826157439295375832948994426470455729189306870468678221733',
        signature_s: '10152946288053072770799687644764930379165069133140049264458237548106772994386',
        argsFields: [ '0', '199' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '21867620188949994967341443637059488290228041682739012169340432910264849527993',
        methodId: '303349388452548671409601861237238963847479248299791980945921844138025566202',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '5',
        signature_r: '10645090537064435838843231200204520604915970788836681883518029478209688046579',
        signature_s: '9328723233436315114382090238562826065036256210251287367264205104059859115137',
        argsFields: [ '0', '199' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '10214175418883685854138560247766975545678216286690700361658843223413954973255',
        methodId: '10838111067477020232051197670527714069850669939012048943880735192070696754402',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '6',
        signature_r: '25203976008252125371883247765811050435943991225636957936015520549284256145121',
        signature_s: '23150701621451813495806068226934140158487330164200769540044398231620277747294',
        argsFields: [],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '1942553032919738154539308629518923388129997532602292436206918410246493475019',
        methodId: '10838111067477020232051197670527714069850669939012048943880735192070696754402',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '7',
        signature_r: '3465424531534180587536253664212234712819637615214040590059956960433096499511',
        signature_s: '11050879734592196861440610723379332878954814718193157194296511842905878736293',
        argsFields: [],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '17393106850938035327468944039611823274944782738117456548985423348341010855856',
        methodId: '14611692223427430559526007140581096422970105604128196339131458122687359281956',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '8',
        signature_r: '28033590998320595418232298615088794009595511276726027892733618242978780498521',
        signature_s: '1116903514831964242740458101383777470467496000151668696303770186881517483572',
        argsFields: [ '0', '2', '10000', '3000' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '27757478914622160432875135242861095050204126581499952102326086969904369291467',
        methodId: '10838111067477020232051197670527714069850669939012048943880735192070696754402',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '9',
        signature_r: '22673109798965073448395138140250726641738419013959756470738804327363993379521',
        signature_s: '11571521807696606928089068893218089212826285818821679358355620722079982983662',
        argsFields: [],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '11305847821187140605713779419801535859887585067143637600919114903625351518477',
        methodId: '7351719328198495562422822994206062791597948445888217083935431958606004497110',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '10',
        signature_r: '5692978669545108431916400595895465817919596624297606081868681364118653689801',
        signature_s: '22686602303496517749946873283171968409346313878080467273607263955546324323402',
        argsFields: [ '0', '2', '99999', '3100', '709' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '3853122276562330458183241462846945889789879673714061132857015176293900939839',
        methodId: '10838111067477020232051197670527714069850669939012048943880735192070696754402',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '11',
        signature_r: '3035522928702519095865355177138668699540836600089465021256851020887297084082',
        signature_s: '26444138824176586681704792999742351028584592555798443020740773249541205474612',
        argsFields: [],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '25009955149354914399593738630220076659610776642249883266813612616857950323138',
        methodId: '7351719328198495562422822994206062791597948445888217083935431958606004497110',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '12',
        signature_r: '28457591919552418848751578398150038885964935018532589295159660885306026862795',
        signature_s: '4873617652678293216276534481171974045492976889710334266835495833515268488447',
        argsFields: [ '0', '2', '99999', '4100', '546' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '14359779896361608127151533872941871128518941866344396517775133227576315233018',
        methodId: '7351719328198495562422822994206062791597948445888217083935431958606004497110',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '13',
        signature_r: '14043489582956336611022433157245270595690410918552631157312609818874175546037',
        signature_s: '10980750077003800479057238924126436303797747415225278784843692716366596000234',
        argsFields: [ '0', '2', '99999', '14300', '792' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '25084100507461052434985923516712060176959609990461473196800573608109091279320',
        methodId: '7351719328198495562422822994206062791597948445888217083935431958606004497110',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '14',
        signature_r: '15248842814829668360511192200615713521690822964717975698263602987269010168043',
        signature_s: '17519369358004007798493425379623417776913494883903516942519875866301080359395',
        argsFields: [ '0', '2', '99999', '14300', '297' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '15347905766136847137898902408985852173078119519071495473142462008177707068963',
        methodId: '14611692223427430559526007140581096422970105604128196339131458122687359281956',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '15',
        signature_r: '15987550569827193825110193789824049271957583610775854325829907003729273481273',
        signature_s: '11090460539521726568142612022465899424456400993235471630178815193242114458001',
        argsFields: [ '1', '2', '10000', '40000' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '19924287821364753493712853266084745990773416049218609931573771248029183909347',
        methodId: '7351719328198495562422822994206062791597948445888217083935431958606004497110',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '16',
        signature_r: '2596915345728436803478982938975540771311028556121835977346430262059270352555',
        signature_s: '12642756648442899343565440351170202591800266768451925403124536791979345895280',
        argsFields: [ '1', '2', '99999', '3100', '9465' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '20849303475980125460743283751818931444072689376905307450640975054702626718874',
        methodId: '7351719328198495562422822994206062791597948445888217083935431958606004497110',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '17',
        signature_r: '11619086208472852919042006618496831230217703295607009075648072526493913676183',
        signature_s: '10102557450402466059171689560143741364946918027676643943335682904833357241573',
        argsFields: [ '1', '2', '99999', '3100', '5842' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '12573006070832433594719392686924638636076265893584822796953425212411561622450',
        methodId: '7351719328198495562422822994206062791597948445888217083935431958606004497110',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '18',
        signature_r: '11161326386328825389026199518948512144706327162692460053846928701941966575961',
        signature_s: '3319569698766174960856833095502584083498734794231138292107069964467437615918',
        argsFields: [ '2', '0', '99999', '3100', '37799' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '25569139764315311322958943751582048613386697205129998452355713852651307238061',
        methodId: '7351719328198495562422822994206062791597948445888217083935431958606004497110',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '19',
        signature_r: '3776076953185076103389266900865102682502713674703753821933192827626191169002',
        signature_s: '16470879712591344654109407872067304886645594030547057096267887131027901080117',
        argsFields: [ '0', '2', '99999', '3100', '1048' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '25520667207423991509794793013807139023098262654816524551068006530069922594094',
        methodId: '10838111067477020232051197670527714069850669939012048943880735192070696754402',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '20',
        signature_r: '27826374471643741888482487473438025117675474450405384980355801081635604700270',
        signature_s: '12117740678550269090094225385581198804177976472786566541060873737192904201377',
        argsFields: [],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '25591449003299495978804036493957616561997455637357146904160775592280953893928',
        methodId: '28794653737248164848411208520344902267260600575076920540986262692894155387993',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '21',
        signature_r: '18343909112420780664821373143120906600672435704701033496459934015106345457659',
        signature_s: '23250792813444976785084273906676021607546385755103925550761694858408408119689',
        argsFields: [ '1', '2', '10000', '15241' ],
        isMessage: false,
        auxiliaryData: []
      },
      {
        hash: '19152439492973119383740910583639932883631089957986284549828903139920780097974',
        methodId: '7351719328198495562422822994206062791597948445888217083935431958606004497110',
        sender: 'B62qp3utjJNZiknBdApspZot6tLSYDKhVazTbwj8RV6gHMDiGK7BEVo',
        nonce: '22',
        signature_r: '11959500409138806413917312892084919506419909844425033747169525717591993909014',
        signature_s: '17148135363374816824358419212395055599650499424038132462502906857869690426285',
        argsFields: [ '0', '2', '99999', '10000', '1283' ],
        isMessage: false,
        auxiliaryData: []
      }
]

export const SLIPPAGE = [
    { value: 0.1, label: '0.1%' },
    { value: 0.2, label: '0.2%' },
    { value: 0.5, label: '0.5%' },
    { value: 1, label: '1%' },
]

export const LIST_FEE_TIER = [
    { value: 0.01, label: '0.01%' },
    { value: 0.05, label: '0.05%' },
    { value: 0.3, label: '0.3%' },
    { value: 1, label: '1%' },
]

export const LIST_STATUS:any = {
    0: {
        value: 'in-range',
        label: 'In Range'
    },
    1: {
        value: 'closed',
        label: 'Closed'
    }
}

export const DRIPBUNDLE = 'dripBundle'
export const CREATEPOOL = 'createPoolSigned'
export const SELLPATH = 'sellPathSigned'
export const ADDLIQUIDITY = "addLiquiditySigned"
export const EMPTY_DATA = '--'