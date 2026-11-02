/* Inventário das gravações incluídas em assets/pinyin. */
window.PinyinData = (() => {
  const soundIndexText = `a:1234 ai:1234 an:1234 ang:1234 ao:1234 ba:1234 bai:1234 ban:1234 bang:1234 bao:1234 bei:1234 ben:1234 beng:1234 bi:1234 bian:1234 biao:234 bie:1234 bin:1234 bing:1234 bo:1234 bu:1234 ca:1234 cai:1234 can:1234 cang:1234 cao:1234 ce:1234 cen:1234 ceng:1234 cha:1234 chai:1234 chan:1234 chang:1234 chao:1234 che:1234 chen:1234 cheng:1234 chi:1234 chong:1234 chou:1234 chu:1234 chua:1234 chuai:1234 chuan:1234 chuang:1234 chui:1234 chun:1234 chuo:1234 ci:1234 cong:1234 cou:1234 cu:1234 cuan:1234 cui:1234 cun:1234 cuo:134 da:1234 dai:1234 dan:1234 dang:1234 dao:1234 de:12345 dei:12345 den:1234 deng:1234 di:1234 dian:1234 diang:234 diao:234 die:1234 ding:1234 diu:1234 dong:1234 dou:1234 du:1234 duan:1234 dui:1234 dun:1234 duo:1234 e:1234 ei:1234 en:1234 er:1234 fa:1234 fan:1234 fang:1234 fei:1234 fen:1234 feng:1234 fo:1234 fou:1234 fu:1234 ga:1234 gai:1234 gan:1234 gang:1234 gao:1234 ge:1234 gei:1234 gen:1234 geng:1234 gong:1234 gou:1234 gu:1234 gua:1234 guai:1234 guan:1234 guang:1234 gui:1234 gun:1234 guo:1234 ha:1234 hai:1234 han:1234 hang:1234 hao:1234 he:1234 hei:1234 hen:1234 heng:1234 hong:1234 hou:1234 hu:1234 hua:1234 huai:1234 huan:1234 huang:1234 hui:1234 hun:1234 huo:1234 ji:1234 jia:1234 jian:1234 jiang:1234 jiao:1234 jie:1234 jin:1234 jing:134 jiong:1234 jiu:1234 ju:1234 juan:1234 jue:1234 jun:1234 ka:1234 kai:1234 kan:1234 kang:124 kao:1234 ke:1234 ken:1234 keng:1234 kong:1234 kou:1234 ku:1234 kua:1234 kuai:1234 kuan:1234 kuang:1234 kui:1234 kun:1234 kuo:1234 la:1234 lai:1234 lan:1234 lang:1234 lao:1234 le:12345 lei:1234 leng:1234 li:1234 lia:1234 lian:1234 liang:1234 liao:1234 lie:1234 lin:234 ling:1234 liu:1234 lo:1234 long:1234 lou:1234 lu:1234 luan:1234 lun:234 luo:1234 luu:1234 luue:1234 luun:1234 ma:12345 mai:1234 man:1234 mang:1234 mao:1234 me:1234 mei:1234 men:1234 meng:1234 mi:1234 mian:1234 miao:1234 mie:1234 min:1234 ming:1234 miu:1234 mo:1234 mou:124 mu:1234 muo:3 na:1234 nai:1234 nan:1234 nang:1234 nao:1234 ne:12345 nei:1234 nen:1234 neng:1234 ni:1234 nia:1234 nian:1234 niang:234 niao:1234 nie:1234 nin:1234 ning:1234 niu:1234 nong:1234 nou:1234 nu:1234 nuan:1234 nue:1 nun:1234 nuo:234 nuu:1234 nuue:234 ou:1234 pa:1234 pai:1234 pan:1234 pang:1234 pao:1234 pei:1234 pen:1234 peng:1234 pi:1234 pian:1234 piao:1234 pie:1234 pin:1234 ping:1234 po:1234 pou:1234 pu:1234 qi:1234 qia:1234 qian:1234 qiang:1234 qiao:1234 qie:1234 qin:1234 qing:1234 qiong:1234 qiu:1234 qu:1234 quan:1234 que:1234 qun:1234 ran:1234 rang:1234 rao:1234 re:1234 rei:1 ren:1234 reng:1234 ri:1234 rong:1234 rou:1234 ru:1234 ruan:1234 rui:234 run:1234 ruo:1234 sa:1234 sai:1234 san:1234 sang:124 sao:1234 se:1234 sei:1234 sen:1234 seng:1234 sha:1234 shai:1234 shan:1234 shang:1234 shao:1234 she:1234 shei:1234 shen:1234 sheng:1234 shi:1234 shong:1234 shou:1234 shu:1234 shua:1234 shuai:1234 shuan:1234 shuang:1234 shui:1234 shun:1234 shuo:1234 si:1234 song:1234 sou:1234 su:1234 suan:1234 sui:1234 sun:1234 suo:1234 ta:1234 tai:1234 tan:1234 tang:1234 tao:1234 te:1234 teng:1234 ti:1234 tian:1234 tiao:1234 tie:1234 ting:1234 tong:1234 tou:1234 tu:1234 tuan:1234 tui:1234 tun:1234 tuo:1234 wa:1234 wai:1234 wan:1234 wang:1234 wei:1234 wen:1234 weng:1234 wo:1234 wu:1234 xi:1234 xia:1234 xian:1234 xiang:134 xiao:1234 xie:1234 xin:124 xing:1234 xiong:1234 xiu:234 xu:1234 xuan:1234 xue:1234 xun:1234 ya:4132 yang:4231 yao:4321 ye:4231 yi:4123 yin:3214 ying:3214 yong:4123 you:4231 yu:3214 yuan:4321 yue:1324 yun:4231 za:4123 zai:134 zan:4132 zang:4123 zao:2314 ze:4321 zei:4321 zen:2314 zeng:1324 zha:3214 zhai:1234 zhan:234 zhang:3214 zhao:4132 zhe:1234 zhei:1234 zhen:4132 zheng:4231 zhi:2314 zhong:4132 zhou:4123 zhu:4132 zhua:2314 zhuai:4321 zhuan:2314 zhuang:3214 zhui:1324 zhun:4123 zhuo:3214 zi:4132 zong:2314 zou:3214 zu:2314 zuan:4132 zui:4231 zun:3214 zuo:4123`;
  const initials = ['', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'];
  const initialOrder = [...initials].sort((a, b) => b.length - a.length);
  const toneNames = { 1: '1º tom', 2: '2º tom', 3: '3º tom', 4: '4º tom', 5: 'tom neutro' };
  const toneMarks = { a: ['ā', 'á', 'ǎ', 'à'], e: ['ē', 'é', 'ě', 'è'], i: ['ī', 'í', 'ǐ', 'ì'], o: ['ō', 'ó', 'ǒ', 'ò'], u: ['ū', 'ú', 'ǔ', 'ù'], ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'] };
  const normalizedSoundIndexText = soundIndexText.replace('ya:4132 yang', 'ya:4132 yan:1234 yang');
  const soundIndex = Object.fromEntries(normalizedSoundIndexText.trim().split(/\s+/).map((entry) => {
    const [base, tones] = entry.split(':');
    return [base, tones.split('').map(Number)];
  }));
  // Dois arquivos chegaram sem o número do tom no nome; eles completam lacunas claras da série.
  const specialAudioFiles = { 'luun:1': 'luun.mp3', 'zhai:4': 'zhai.mp3' };

  const displayBase = (base) => base.replaceAll('uu', 'ü');
  const getInitial = (base) => initialOrder.find((initial) => initial && base.startsWith(initial)) || '';
  const getFinal = (base) => displayBase(base).slice(getInitial(base).length);
  const toneClass = (tone) => tone === 5 ? 'tone-neutral' : `tone-${tone}`;

  function toned(base, tone) {
    const plain = displayBase(base);
    if (tone === 5) return plain;
    let index = plain.indexOf('a');
    if (index < 0) index = plain.indexOf('e');
    if (index < 0 && plain.includes('ou')) index = plain.indexOf('o');
    if (index < 0) {
      for (let i = plain.length - 1; i >= 0; i -= 1) {
        if ('aeiouü'.includes(plain[i])) { index = i; break; }
      }
    }
    if (index < 0) return plain;
    const vowel = plain[index];
    return `${plain.slice(0, index)}${toneMarks[vowel][tone - 1]}${plain.slice(index + 1)}`;
  }

  function normalizeForAnswer(value) {
    return String(value || '').toLowerCase().trim().replace(/\s+/g, '')
      .replace(/[āáǎà]/g, 'a').replace(/[ēéěè]/g, 'e').replace(/[īíǐì]/g, 'i')
      .replace(/[ōóǒò]/g, 'o').replace(/[ūúǔù]/g, 'u').replace(/[ǖǘǚǜü]/g, 'ü')
      .replace(/[1-5]/g, '').replaceAll('v', 'ü');
  }

  const bases = () => Object.keys(soundIndex).map((base) => ({
    base, display: displayBase(base), initial: getInitial(base), final: getFinal(base), tones: soundIndex[base]
  }));
  const all = () => bases().flatMap((item) => item.tones.map((tone) => ({ ...item, tone, text: toned(item.base, tone) })));

  return Object.freeze({
    initials, toneNames, toneClass, toned, displayBase, getInitial, getFinal, normalizeForAnswer,
    bases, all, tonesFor: (base) => soundIndex[base] || [],
    audioPath: (base, tone) => `assets/pinyin/${specialAudioFiles[`${base}:${tone}`] || `${base}${tone}.mp3`}`,
    sameBase: (answer, base) => normalizeForAnswer(answer) === normalizeForAnswer(displayBase(base))
  });
})();
