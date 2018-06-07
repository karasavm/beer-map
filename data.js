var markersRaw = [];
// {name: 'ΑΘΗΝΕΟ',lat: 38.0036015, log: 23.7072896, latC: 37.9838096, logC:23.7275388,latV: 38.3009838096, logV: 23.7072896, icon: 'athineo.png'},
// {name: 'ΑΝΑΣΤΑΣΙΟΥ ANASTASIOU',lat: 38.02102, log: 23.80189, latC: 37.9838096, logC:23.7275388,latV: 37.9753188, logV: 24.00189-0.05, icon: 'anastasiou.png'},
// {name: 'satiros',lat: 37.9838096, log: 23.7275388, latC: 37.9838096, logC:23.7275388, latV: 38.13838096, logV: 23.6275388, icon: 'satyr.png'},
// {name: 'NOCTUA',lat: 37.9753188, log: 23.7099963, latC: 37.9838096, logC:23.7275388, latV: 37.6753188, logV: 23.8199963, icon: 'noctua.png'},
// {name: 'ASYLUM BEER',lat: 37.948907, log: 23.743755, latC: 37.9838096, logC:23.7275388, latV: 37.8053188, logV: 23.993755 , icon: 'asylum.png'},
// {name: 'ΜΑΡΕΑ ##MAREA',lat: 37.9829262, log: 23.7190463, latC: 37.9838096, logC:23.7275388,latV: 37.7753188, logV: 23.6190463, icon: 'marea.png'},
// {name: 'ΣΤΕΡΓΙΟΥ',lat: 37.8328926, log: 23.8056149, latC: 37.9838096, logC:23.7275388, latV: 37.9838096, logV:23.5275388, icon: 'stergiou.png'},
// {name: 'ZHTA-HTA-ΘΗΤΑ',lat: 38.0231582, log: 23.8073881, latC: 37.9838096, logC:23.7275388,latV: 38.16838096, logV: 23.9073881 ,  icon: 'thita-ita.png'},




testData = [
	{id: 1,name: 'ΕΖΑ',icon: 'eza.png', mapUrl: 'https://www.google.gr/maps/place/Hellenic+Breweries+of+Atalanti+S.A./@38.6312018,22.7951828,10z/data=!4m8!1m2!2m1!1seza+microbrewery!3m4!1s0x14a0c199d6eb9d8f:0x82c3c2fa7b0d9dda!8m2!3d38.6312018!4d23.0753342'},
{id: 2,name: 'ΒΕΡΓΙΝΑ',icon: 'vergina.png', mapUrl: 'https://www.google.gr/maps/place/Vergina+Beer+factory/@41.0226797,25.4495604,12.67z/data=!4m5!3m4!1s0x14adf1c6a5dd8b5d:0x15ac71b26c9bb566!8m2!3d41.0738353!4d25.492092'},
{id: 3,name: 'SEPTEM',icon: 'septem.png', mapUrl: 'https://www.google.gr/maps/place/Septem+Microbrewery/@38.5350089,24.1108791,15z/data=!4m5!3m4!1s0x0:0x38bac46c537cb731!8m2!3d38.5350089!4d24.1108791'},
{id: 4,name: 'CORFU BEER',icon: 'corfu.png', mapUrl: 'https://www.google.gr/maps/place/Corfu+Beer+%CE%9A%CE%B5%CF%81%CE%BA%CF%85%CF%81%CE%B1%CF%8A%CE%BA%CE%AE+%CE%96%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1/@39.7468394,19.648364,14.25z/data=!4m5!3m4!1s0x135b4dfb775399a1:0xd79fd6503283f090!8m2!3d39.7494378!4d19.6568128'},
{id: 5,name: 'ZEOS',icon: 'zeos.png', mapUrl: 'https://www.google.gr/maps/place/Zeos+Breweries+S.A./@37.6580027,22.7437014,16z/data=!4m5!3m4!1s0x149ffbe14f3ea941:0xa835c99f7977dd30!8m2!3d37.6590984!4d22.7457882'},
{id: 6,name: 'MAGNUS',icon: 'magnus.png', mapUrl: 'https://www.google.gr/maps/place/Magnus+Magister+Papadimitriou+S.A/@36.3706317,28.0650966,13.25z/data=!4m8!1m2!2m1!1zzpbOpc6Yzp_OoM6fzpnOmc6RIM6hzp_OlM6fzqU!3m4!1s0x14957b25cbab085b:0x1ef85d77f93e4614!8m2!3d36.3772406!4d28.0978346'},
{id: 7,name: 'BRINKS',icon: 'brinks.png', mapUrl: 'https://www.google.gr/maps/place/Rethymnian+Brewery+S.A./@35.3024262,24.4583361,16z/data=!4m5!3m4!1s0x149b7508ce2e3fed:0x82d765b479de9af!8m2!3d35.3032668!4d24.4599937'},
{id: 8,name: 'CRAZY DONKEY',icon: 'donkey.png', mapUrl: 'https://www.google.gr/maps/place/Santorini+Brewing+Company/@36.4071539,25.4206309,12z/data=!4m8!1m2!2m1!1zzpbOpc6Yzp_OoM6fzpnOmc6RIM6jzpHOnc6kzp_Ooc6Zzp3Ol86j!3m4!1s0x1499ce18f7a849df:0x2e572f9b2c435648!8m2!3d36.384082!4d25.4645213'},
{id: 9,name: 'CHIOS BEER',icon: 'chios.png', mapUrl: 'https://www.google.gr/maps/place/Chios+Beer+-+%CE%96%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%A7%CE%AF%CE%BF%CF%85/@38.319989,26.126711,17z/data=!3m1!4b1!4m5!3m4!1s0x14bb615187908c63:0x1f6fe99f353179ff!8m2!3d38.319989!4d26.126711'},
{id: 10,name: 'ΒΑΠ',icon: 'vap.png', mapUrl: 'https://www.google.gr/maps/place/Vap+P.+Kouyos+S.A./@36.3818988,28.1978325,17z/data=!4m12!1m6!3m5!1s0x149563f7e20038f5:0xd2680a6de4a5f42c!2sVap+P.+Kouyos+S.A.!8m2!3d36.3818988!4d28.1978325!3m4!1s0x149563f7e20038f5:0xd2680a6de4a5f42c!8m2!3d36.3818988!4d28.1978325'},
{id: 11,name: 'ΝΗΣΟΣ',icon: 'nhsos.png', mapUrl: 'https://www.google.gr/maps/place/%CE%9D%CE%97%CE%A3%CE%9F%CE%A3+Beer/@37.6017436,25.1131911,11z/data=!4m8!1m2!2m1!1zzpzOmc6azqHOn86WzqXOmM6fzqDOn86ZzpnOkSDOms6lzprOm86RzpTOqc6dIM6jzqTOl86dIM6kzpfOnc6f!3m4!1s0x14a2ec02da080b6f:0xa050ccefda014c8b!8m2!3d37.5388756!4d25.1749806'},
{id: 12,name: 'ΧΑΡΜΑ',icon: 'charma.png', mapUrl: 'https://www.google.gr/maps/place/Cretan+Brewery+S.A.+%CE%9A%CF%81%CE%B7%CF%84%CE%B9%CE%BA%CE%AE+%CE%96%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%91.%CE%95/@35.48685,23.825786,17z/data=!3m1!4b1!4m12!1m6!3m5!1s0x149c8bb3ccd1b743:0x318bf645e5ada059!2zQ3JldGFuIEJyZXdlcnkgUy5BLiDOms-BzrfPhM65zrrOriDOls-FzrjOv8-Azr_Ouc6vzrEgzpEuzpU!8m2!3d35.48685!4d23.825786!3m4!1s0x149c8bb3ccd1b743:0x318bf645e5ada059!8m2!3d35.48685!4d23.825786'},
{id: 13,name: 'ΒΟΡΕΙΑ',icon: 'voreia.png', mapUrl: 'https://www.google.gr/maps/place/SIRIS+MICROBREWERY+E.E./@41.0845604,23.6175281,17z/data=!3m1!4b1!4m12!1m6!3m5!1s0x14a951544e6b926f:0x8af52ba095597e93!2sSIRIS+MICROBREWERY+E.E.!8m2!3d41.0845604!4d23.6175281!3m4!1s0x14a951544e6b926f:0x8af52ba095597e93!8m2!3d41.0845604!4d23.6175281'},
{id: 14,name: 'VOLKAN',icon: 'volkan.png', mapUrl: 'https://www.google.gr/maps/place/Santorini/@36.4071334,25.3505904,12z/data=!3m1!4b1!4m5!3m4!1s0x1499ce86adfd9ff7:0xb2a761f740d68afc!8m2!3d36.3931562!4d25.4615092'},
{id: 15,name: 'ZHTA-HTA-ΘΗΤΑ',icon: 'thita-ita.png', mapUrl: 'https://www.google.com/maps/place/Diogenous+8,+Chalandri+152+34/@38.0231582,23.8051994,17z/data=!3m1!4b1!4m5!3m4!1s0x14a198fc49067511:0xc2d87ea7b50f038a!8m2!3d38.0231582!4d23.8073881'},
{id: 16,name: 'CANAL DIVE',icon: 'canal.png', mapUrl: 'https://www.google.gr/maps/place/%CE%9A%CE%9F%CE%A1%CE%99%CE%9D%CE%98%CE%99%CE%91%CE%9A%CE%97+%CE%96%CE%A5%CE%98%CE%9F%CE%A0%CE%9F%CE%99%CE%AA%CE%91+%CE%91.%CE%95./@37.9234561,22.8710389,15z/data=!4m8!1m2!2m1!1zzprOn86hzpnOnc6YzpnOkc6azpcgzpbOpc6Yzp_OoM6fzpnOmc6R!3m4!1s0x14a011671a7e0577:0x72f53c6a9c48af1c!8m2!3d37.9234561!4d22.8797936'},
{id: 17,name: 'SOLO',icon: 'solo.png', mapUrl: "https://www.google.com/maps/place/35%C2%B018'44.2%22N+25%C2%B010'31.6%22E/@35.312276,25.1579348,14z/data=!3m1!4b1!4m13!1m7!3m6!1s0x0:0x0!2zMzXCsDE4JzQ0LjIiTiAyNcKwMTAnMzEuNiJF!3b1!8m2!3d35.31229!4d25.17545!3m4!1s0x0:0x0!8m2!3d35.31229!4d25.17545"},
{id: 18,name: 'ΣΤΕΡΓΙΟΥ',icon: 'stergiou.png', mapUrl: 'https://www.google.com/maps/place/Triptolemou+17,+Vari+166+72/@37.8328926,23.8034262,17z/data=!4m13!1m7!3m6!1s0x14a195215ca68417:0xe16d5f4875e755ea!2sTriptolemou+17,+Vari+166+72!3b1!8m2!3d37.8328926!4d23.8056149!3m4!1s0x14a195215ca68417:0xe16d5f4875e755ea!8m2!3d37.8328926!4d23.8056149'},
{id: 19,name: 'ΠΛΑΣΤΙΓΓΑ',icon: 'plastigga.png', mapUrl: 'https://www.google.com/maps/place/Ermou+64,+Volos+383+33/@39.3627696,22.9415707,17z/data=!4m13!1m7!3m6!1s0x14a76c65b747feef:0x96871f8c77ad610b!2sErmou+64,+Volos+383+33!3b1!8m2!3d39.3627696!4d22.9437594!3m4!1s0x14a76c65b747feef:0x96871f8c77ad610b!8m2!3d39.3627696!4d22.9437594'},
{id: 20,name: 'ΣΚΝΙΠΑ',icon: 'sknipa.png', mapUrl: 'https://www.google.gr/maps/place/SKNIPA+%CE%A0%CF%81%CF%8C%CF%84%CF%85%CF%80%CE%B7+%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1/@40.5280406,23.0413982,17z/data=!3m1!4b1!4m5!3m4!1s0x14a84051dd872c1d:0xfff156573db85f74!8m2!3d40.5280406!4d23.0413982'},
{id: 21,name: 'KEFALLONIAN BEER',icon: 'kefallonian.png', mapUrl: 'https://www.google.gr/maps/place/Kefalonian+Beer+-+%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%9A%CE%B5%CF%86%CE%B1%CE%BB%CE%BF%CE%BD%CE%B9%CE%AC%CF%82+%26+%CE%99%CE%B8%CE%AC%CE%BA%CE%B7%CF%82/@38.2567968,20.6269362,17z/data=!4m12!1m6!3m5!1s0x135d8dda9155abb5:0xc645f2fd9b275254!2zS2VmYWxvbmlhbiBCZWVyIC0gzpzOuc66z4HOv862z4XOuM6_z4DOv865zq_OsSDOms61z4bOsc67zr_Ovc65zqzPgiAmIM6ZzrjOrM66zrfPgg!8m2!3d38.2567968!4d20.6269362!3m4!1s0x135d8dda9155abb5:0xc645f2fd9b275254!8m2!3d38.2567968!4d20.6269362'},
{id: 22,name: 'ΑΛΗ',icon: 'ali.png', mapUrl: 'https://www.google.gr/maps/place/%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%98%CE%B5%CF%83%CF%83%CE%B1%CE%BB%CE%BF%CE%BD%CE%AF%CE%BA%CE%B7%CF%82/@40.6859526,22.747106,12z/data=!4m8!1m2!2m1!1zzpzOmc6azqHOn86WzqXOmM6fzqDOn86ZzpnOkSDOmM6VzqPOo86RzpvOn86dzpnOms6XzqM!3m4!1s0x14a83ab152d46f0b:0xea139b01dc260b12!8m2!3d40.6859526!4d22.8171438'},
{id: 23,name: 'ΟΛΥΜΠΟΣ',icon: 'olymposbeer.png', mapUrl: 'https://www.google.com/maps/place/Thessalonikis+106,+Katerini+601+00/@40.2786946,22.5141866,17z/data=!4m13!1m7!3m6!1s0x135802189b242f79:0x76691dfa67c1e013!2sThessalonikis+106,+Katerini+601+00!3b1!8m2!3d40.2786946!4d22.5163753!3m4!1s0x135802189b242f79:0x76691dfa67c1e013!8m2!3d40.2786946!4d22.5163753'},
{id: 24,name: 'ΔΙΩΝΗ-ΟΡΑ',icon: 'patraiki.png', mapUrl: 'https://www.google.gr/maps/place/PATRAIKI+ZYTHOPOIIA+P.C./@38.1751188,21.6814406,17z/data=!3m1!4b1!4m5!3m4!1s0x135e3708bb07c613:0xac4b5ce025ac326d!8m2!3d38.1751188!4d21.6814406'},
{id: 25,name: 'ΣΤΑΛΛΑ ΡΟΥΣΣΑ',icon: 'stala.png', mapUrl: 'https://www.google.com/maps/place/Rodotopi+455+00/@39.7075519,20.7218318,16z/data=!3m1!4b1!4m5!3m4!1s0x135bc01d612efb95:0xe93ee1fc84bcfa90!8m2!3d39.7083252!4d20.7237136'},
{id: 26,name: 'ΣΤΙΛΒΗ',icon: 'stilvi.png', mapUrl: 'https://www.google.gr/maps/place/%CE%96%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%98%CE%B5%CF%83%CF%83%CE%B1%CE%BB%CE%AF%CE%B1%CF%82+%CE%99%CE%9A%CE%95/@39.3847865,21.9164006,17z/data=!3m1!4b1!4m5!3m4!1s0x1358d93b6490ef7b:0x514730a17c833e7!8m2!3d39.3847865!4d21.9185893'},
{id: 27,name: 'ΜΑΡΕΑ ',icon: 'marea.png', mapUrl: 'https://www.google.com/maps/place/Millerou+27,+Athina+104+36/@37.9829262,23.7168576,17z/data=!3m1!4b1!4m5!3m4!1s0x14a1bd26f92bf25d:0x3962df9fbdc75349!8m2!3d37.9829262!4d23.7190463'},
{id: 28,name: 'ΑΘΗΝΕΟ',icon: 'athineo.png', mapUrl: 'https://www.google.com/maps/place/Leof.+Kifisou+102,+Peristeri+121+32/@38.0036015,23.7051009,17z/data=!3m1!4b1!4m5!3m4!1s0x14a1a32e85ad0713:0x5b53363996664b53!8m2!3d38.0036015!4d23.7072896'},
{id: 29,name: 'ΛΥΡΑ',icon: 'lyra.png', mapUrl: 'https://www.google.gr/maps/place/LYRA+BEER+%CE%9C%CE%B5%CF%83%CE%BF%CE%B3%CE%B5%CE%B9%CE%B1%CE%BA%CE%AE+%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CF%8A%CE%B1+%CE%9A%CF%81%CE%AE%CF%84%CE%B7%CF%82/@35.4954916,23.6545257,17z/data=!3m1!4b1!4m5!3m4!1s0x149cf6b0748f4777:0xd53c409233321929!8m2!3d35.4954916!4d23.6545257'},
{id: 30,name: 'OLYMPICA MAGNA',icon: 'magna.png', mapUrl: 'https://www.google.com/maps/place/Elis+Brewery/@37.7307886,21.6164215,9.67z/data=!4m5!3m4!1s0x136096a8888f8c89:0x1ea879a6cc97ed1c!8m2!3d37.7093679!4d21.5595479'},
{id: 31,name: 'JOHNNIES BEER',icon: 'johnnies.png', mapUrl: "https://www.google.gr/maps/place/%CE%9C%CE%B1%CE%BA%CE%B5%CE%B4%CE%BF%CE%BD%CE%B9%CE%BA%CE%AE+%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+-+Johnnies'+Beer/@41.089483,24.224047,17z/data=!3m1!4b1!4m5!3m4!1s0x14aeabf12b3b82fd:0xc7d80e097867b6db!8m2!3d41.089483!4d24.224047"},
{id: 32,name: 'ΛΗΘΕΝΙΑ',icon: 'trikalwn.png', mapUrl: 'https://www.google.gr/maps/place/%CE%A4%CF%81%CE%B9%CE%BA%CE%AC%CE%BB%CF%89%CE%BD+%CE%96%CF%8D%CE%B8%CE%BF%CF%82/@39.5467904,21.7739378,17z/data=!3m1!4b1!4m5!3m4!1s0x13591ed7f4afc0f5:0x1c1d8d52de1a7ea6!8m2!3d39.5467904!4d21.7739378'},
{id: 33,name: '56',icon: 'paros2.png', mapUrl: "https://www.google.com/maps/place/37%C2%B006'38.3%22N+25%C2%B014'36.6%22E/@37.1106371,25.2259904,14z/data=!3m1!4b1!4m13!1m7!3m6!1s0x0:0x0!2zMzfCsDA2JzM4LjMiTiAyNcKwMTQnMzYuNiJF!3b1!8m2!3d37.11064!4d25.24349!3m4!1s0x0:0x0!8m2!3d37.11064!4d25.24349"},
{id: 34,name: 'ΘΕΡΟΣ',icon: 'theros.png', mapUrl: 'https://www.google.gr/maps/place/Solar+micro+brewery+Xanthi/@41.112538,24.87042,17z/data=!3m1!4b1!4m5!3m4!1s0x14ac2ceda125ebab:0xe36f8a739f14d193!8m2!3d41.112538!4d24.87042'},
{id: 35,name: 'ΚΑΤΣΙΚΑ',icon: 'katsika.png', mapUrl: "https://www.google.com/maps/place/36%C2%B037'33.7%22N+24%C2%B055'08.2%22E/@36.626027,24.9101896,15z/data=!3m1!4b1!4m13!1m7!3m6!1s0x0:0x0!2zMzbCsDM3JzMzLjciTiAyNMKwNTUnMDguMiJF!3b1!8m2!3d36.62603!4d24.91894!3m4!1s0x0:0x0!8m2!3d36.62603!4d24.91894"},
{id: 36,name: 'NAXOS BEER',icon: 'naxos.png', mapUrl: 'https://www.google.com/maps/place/Naxos/@37.0598888,25.3295715,11z/data=!3m1!4b1!4m13!1m7!3m6!1s0x149808a6fa0089c1:0xf47adb634b92d218!2sNaxos!3b1!8m2!3d37.1035665!4d25.3776734!3m4!1s0x149808a6fa0089c1:0xf47adb634b92d218!8m2!3d37.1035665!4d25.3776734'},
{id: 37,name: 'ΗΠΕΙΡΟΣ',icon: 'ipiros.png', mapUrl: "https://www.google.com/maps/place/39%C2%B009'35.8%22N+20%C2%B058'58.9%22E/@39.15995,20.9808413,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d39.15995!4d20.98303"},
{id: 38,name: 'SPARTA',icon: 'sparta.png', mapUrl: 'https://www.google.com/maps/place/Lakoniki+Brewery/@36.89304,22.5166913,17z/data=!4m13!1m7!3m6!1s0x0:0x0!2zMzbCsDUzJzM0LjkiTiAyMsKwMzEnMDguMCJF!3b1!8m2!3d36.89304!4d22.51888!3m4!1s0x0:0xb44010a0916dfe17!8m2!3d36.8930947!4d22.5184697'},
{id: 39,name: 'FONIAS',icon: 'samothraki.png', mapUrl: 'https://www.google.gr/maps/place/%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%A3%CE%B1%CE%BC%CE%BF%CE%B8%CF%81%CE%AC%CE%BA%CE%B7%CF%82+%2F+Samothraki+Microbrewery/@40.4732432,25.4807834,15z/data=!4m5!3m4!1s0x0:0xbafa059bd20c6718!8m2!3d40.4732432!4d25.4807834'},
{id: 40,name: 'NOCTUA',icon: 'noctua.png', mapUrl: 'https://www.google.gr/maps/place/Noctua+Brewery+Athens/@37.9753188,23.7099963,17z/data=!3m1!4b1!4m5!3m4!1s0x14a1bce0d4746151:0x551e97ccd19f4fa8!8m2!3d37.9753188!4d23.7099963'},
{id: 41,name: 'VAMBEER',icon: 'korfi.png', mapUrl: 'https://www.google.gr/maps/place/Kato+Agios+Ioannis+601+00/@40.3248631,22.5258833,16z/data=!3m1!4b1!4m13!1m7!3m6!1s0x1357ff2de0388881:0x7a5eafe7072ccb5d!2sKato+Agios+Ioannis+601+00!3b1!8m2!3d40.3248556!4d22.5301856!3m4!1s0x1357ff2de0388881:0x7a5eafe7072ccb5d!8m2!3d40.3248556!4d22.5301856'},
{id: 42,name: 'MYKONOS',icon: 'mikonos.png', mapUrl: 'https://www.google.gr/maps/place/Mykonos+Brewing+Company/@37.447288,25.344194,17z/data=!3m1!4b1!4m5!3m4!1s0x14a2bf10120d7abb:0x11b51e385bd2d1a3!8m2!3d37.447288!4d25.344194'},
{id: 43,name: 'NOTOΣ',icon: 'notos.png', mapUrl: 'https://www.google.gr/maps/place/Notos+Brewery/@35.3294596,25.114209,17z/data=!3m1!4b1!4m5!3m4!1s0x149a59f25affe157:0x12ec492facfb3b84!8m2!3d35.3294596!4d25.114209'},
{id: 44,name: 'ΚΑΡΜΑ',icon: 'karma.png', mapUrl: 'https://www.google.com/maps/place/KARMA+%CE%96%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%A0%CE%B5%CE%BB%CE%BF%CF%80%CE%BF%CE%BD%CE%BD%CE%AE%CF%83%CE%BF%CF%85/@37.823823,22.647369,12z/data=!4m5!3m4!1s0x0:0x83635b5a4748685a!8m2!3d37.819755!4d22.647712'},
{id: 45,name: 'ASYLUM BEER',icon: 'asylum.png', mapUrl: 'https://www.google.gr/maps/place/Anagenniseos+1,+Imittos+172+36/@37.948907,23.7415663,17z/data=!3m1!4b1!4m13!1m7!3m6!1s0x14a1bd9e40ffeec5:0xf3c8162293b557d3!2sAnagenniseos+1,+Imittos+172+36!3b1!8m2!3d37.948907!4d23.743755!3m4!1s0x14a1bd9e40ffeec5:0xf3c8162293b557d3!8m2!3d37.948907!4d23.743755'},
{id: 46,name: 'LEVANTE',icon: 'levande.png', mapUrl: 'https://www.google.gr/maps/place/LEVANTE+BEERS+ZAKYNTHOS/@37.8723145,20.7307569,17z/data=!4m12!1m6!3m5!1s0x13674217779bfd77:0xb33b205f4ff8ea7!2sLEVANTE+BEERS+ZAKYNTHOS!8m2!3d37.8723145!4d20.7329456!3m4!1s0x13674217779bfd77:0xb33b205f4ff8ea7!8m2!3d37.8723145!4d20.7329456'},
{id: 47,name: 'ΙΚΑΡΙΩΤΙΣΣΑ',icon: 'ikariotissa.png', mapUrl: 'https://www.google.gr/maps/place/Icaria/@37.5998642,26.0296138,11z/data=!3m1!4b1!4m5!3m4!1s0x14bd1d88f2402c4f:0x2a22c3406064214f!8m2!3d37.5967227!4d26.1123078'},
{id: 48,name: 'ONIRO',icon: 'dreamer.png', mapUrl: "https://www.google.gr/maps/place/40%C2%B030'55.0%22N+22%C2%B012'12.9%22E/@40.51528,22.2013913,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d40.51528!4d22.20358"},
{id: 49,name: 'ΑΝΑΣΤΑΣΙΟΥ',icon: 'anastasiou.png', mapUrl: "https://www.google.gr/maps/place/38%C2%B001'15.7%22N+23%C2%B048'06.8%22E/@38.0188259,23.7918128,14.71z/data=!4m5!3m4!1s0x0:0x0!8m2!3d38.02102!4d23.80189"},
{id: 50,name: 'satiros',icon: 'satyr.png', mapUrl: 'https://www.google.com/maps/place/Athens/@37.990832,23.7033198,13z/data=!3m1!4b1!4m5!3m4!1s0x14a1bd1f067043f1:0x2736354576668ddd!8m2!3d37.9838096!4d23.7275388'},
{id: 51,name: 'SEVEN ISLAND',icon: 'seven_island.png', mapUrl: "https://www.google.com/maps/place/39%C2%B037'06.5%22N+19%C2%B054'26.8%22E/@39.61847,19.9052413,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d39.61847!4d19.90743"},
{id: 52,name: 'ΑΡΓΩ',icon: 'argo.png', mapUrl: 'https://www.google.gr/maps/place/%CE%9C%CE%B9%CE%BA%CF%81%CE%BF%CE%B6%CF%85%CE%B8%CE%BF%CF%80%CE%BF%CE%B9%CE%AF%CE%B1+%CE%98%CE%B5%CF%83%CF%83%CE%B1%CE%BB%CE%AF%CE%B1%CF%82/@39.3632214,13.9696698,5z/data=!4m8!1m2!2m1!1zzrHPgc6zz4kgYmVlcg!3m4!1s0x14a76c6dc928c34b:0xae93b43a88f4cc55!8m2!3d39.3632214!4d22.9345136'},
{id: 53,name: 'DARK CROPS BREWERY',icon: 'dark_crops.png', mapUrl: ''},
{id: 54,name: 'JASMINE',icon: 'jasmine.png', mapUrl: ''},
{id: 55,name: 'HOPPY CARAVAN',icon: 'hoppy_caravan.png', mapUrl: ''},
{id: 56,name: 'WINGS',icon: 'icarian_spirit.png', mapUrl: "https://www.google.gr/maps/place/37%C2%B033'39.6%22N+26%C2%B003'11.6%22E/@37.5610042,26.0510214,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d37.5610042!4d26.0532101"},
{id: 57,name: 'ΛΕΥΚΑ ΟΡΗ',icon: 'lafkas.png', mapUrl: 'https://www.google.com/maps/place/Lafkas+Brewery/@35.4945808,23.9838765,17z/data=!3m1!4b1!4m5!3m4!1s0x149c8788ddc82b49:0x8ee32eaeecced606!8m2!3d35.4945808!4d23.9860652'},
{id: 58,name: 'PIKRI-KIRKH-NIKH',icon: 'kirki.png', mapUrl: 'https://www.google.com/maps/place/Koundourou+Manousou+36,+Pireas+185+33/@37.9383906,23.6554681,17z/data=!3m1!4b1!4m5!3m4!1s0x14a1bbfaa1d8bafd:0x9b02119dff455d9f!8m2!3d37.9383906!4d23.6576568'},
{id: 59,name: "ΠΕΡΙΣΤΕΡΙ",icon: "peristeri.png", mapUrl: "https://www.google.gr/maps/place/Peristeri/@38.0156529,23.6571215,13z/data=!3m1!4b1!4m5!3m4!1s0x14a1a338a717f79b:0x400bd2ce2b97ab0!8m2!3d38.0176649!4d23.6859275"},
{id: 60,name: 'ΠΕΙΡΑΙΚΗ',icon: 'piraiki.png', mapUrl: 'https://www.google.gr/maps/place/Piraeus+Microbrewery+S.A./@37.9466559,23.6230802,15z/data=!4m5!3m4!1s0x0:0x7c4110cd57d5fcaa!8m2!3d37.9466559!4d23.6230802'},
{id: 61,name: 'MIND NIGHT CIRCUS',icon: 'midnight_circus.png', mapUrl: 'https://www.google.com/maps/place/Str.+Kontouli+7,+Athina+117+42/@37.9656671,23.7245736,17z/data=!3m1!4b1!4m8!1m2!2m1!1sMidnight+Circus+Gypsy+Brewing,Str.+Kontouli+7,+Athens,+,+Greece,+11742!3m4!1s0x14a1bd1a9061c205:0xb94eed9688c01729!8m2!3d37.965667!4d23.7267626'},
{id: 62,name: 'ΠΗΝΕΙΟΣ',icon: 'phneios.png', mapUrl: 'https://www.google.gr/maps/place/Paleologou+19,+Larisa+412+23/@39.6303528,22.4196001,17z/data=!3m1!4b1!4m5!3m4!1s0x135888a3c7e7626d:0x2b40bf5a36f28c9!8m2!3d39.6303528!4d22.4217888'},
{id: 63,name: 'ΣΠΙΡΑ',icon: 'spira.png', mapUrl: "https://www.google.com/maps/place/39%C2%B007'12.1%22N+23%C2%B043'49.1%22E/@39.12003,23.7281213,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d39.12003!4d23.73031"},
];


for (var i=0; i < testData.length; i ++) {
	
	if (testData[i].mapUrl !== '') {
		console.log("name", testData[i].id);
		var sp = testData[i].mapUrl.split("!3d");

		sp = sp[sp.length-1]


		markersRaw.push({
			name: testData[i].id.toString(),
			lat: Number(sp.split("!4d")[0]),
			log: Number(sp.split("!4d")[1]),
			icon: testData[i].icon,
			mapUrl: testData[i].mapUrl
		})
	} else {
		console.log("empty")
	}

}


