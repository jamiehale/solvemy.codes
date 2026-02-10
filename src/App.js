import React, { useEffect, useCallback, useState } from "react";
import Button from "@material-ui/core/Button";
import useGameInput from "./game-input";
import usePuzzleKey from "./puzzle-key";
import Board from "./Board";
import UserInput from "./UserInput";
import Stack from "./Stack";

// const puzzle = 'za uiwaoys urwlyl, tuio sr nrw dikk lyol re loygl kyiszam wg or uzmuyb ekrrbl? ldiby-tinl.';
// const clues = { u: 'h' };

// const puzzle = 'xbvrgige jsusxsfmr vdiv nvigvn "vs odrrnr sg usv vs odrrnr, vdiv bn vdr pmrnvbsu": sjrxrv\'n nsxbxspme.';
// const clues = { o: 'c' };

// const puzzle = 'tbqg hdrbg euf kqcc ifprzj tbu qnz pzkzag, hunqcce ondakdoczp qap ifjg? buaunqscz hzajkbza.';
// const clues = { h: 'm' };

// const puzzle = 'lfes emw slv pbi sfbdiy sfes edj gboysbhx-kexbdi hvkoedj yfvrgz hemw epvrs? omvabs edz igvyy.';
// const clues = { i: 'g' };

// const puzzle = 'pryv zruhqw muh jyqq suqlz pru yfg gzogjeyqqm buuw yv bgvveib ogzlm eizgjvz vu sqm ypym? zruueib zvyfz.';
// const clues = { q: 'l' };

// const puzzle = 'dlym c wryym qm xly xlfqmy ek dexl vleta arfemp lyf frty, e krzzqky ex\'k c fypmcmvh zfypmcmvh.'
// const clues = { p: 'g' };

// const puzzle = `xc k wimegmin uxejxm ajktiw okn nxhleuiwin k mig hailxih ec hikpxwn, xq bkt okui piim mkbin "xhkkl'h qiwm."`;
// const clues = { u: 'v' };

// const puzzle = `wj t atpdh bj ocdtq gbqiadcdap dekdabio obqdcswen, vbraz pbr gbeowxdh cstc vhtiiwen ktibh?`;
// const clues = { p: 'y' };

// const puzzle = `cwbi ziw vweqowgt ruwkiur wa z odzbg bzeq awd z jkddqbrct swskczd rwwruszvrq, zbg ruq jdqvr nv unvrwdt.`;
// const clues = { r: 't' };

// const puzzle = `zfwg sfw cqiw iqc acpnwc dwiqrw pgnubnwa pg q dpk liqgaqb, p zuyba lqt fw kqpgwa rusuc-pwst.`;
// const clues = { r: 'm' };

// const puzzle = `wjoj'x wuferh kwzk ij jrq bf wzaerh zr jybgjozrk kzye qoeajo. kwjoj'x rukwerh iuoxj kwzr z mozggt mzggt.`;
// const clues = { g: 'b' };

// const puzzle = `rd vywb drjklbov uob mbrxj qxmbfrbnumfs rffyjrtuf, syq wus kunb ly tuff rx lkb oulryxuf jquoz.`;
// const clues = { j: 'g' };

// const puzzle = `ana vfuhd vxu uoouhda wbvnuwh snwbjjm hnew b odbgd beqddldwv? xfm mdh vfdm ana, bh b lbvvdq us obgv.`;
// const clues = { g: 'c' };

// const puzzle = `tre xm ema ojshmq zrj jkzojgj sjojvb xjfmzjj bmfjw lmcql mq zociw zm zrj waijogvohjz? cz'w rmt rj ljzw rcw hck.`;
// const clues = { k: 'x' };

// const puzzle = `vcdsg wutouhr ykedc zktzcstdtb u bdsn'h scnuodec vfk opsth dtok u ycsyudg: "yr zkphdt wdttr.`;
// const clues = { r: 'y' };

// const puzzle = `bq psl tgfg hssybmu qsf w ibeg es cs w rgfewbm jwhhfssa cwmrg, psl abune wiy isagsmg "tngfg cs b jgulbmg?`;
// const clues = { p: 'y' };

// const puzzle = `zvkl mvk amgnp minlko gim mg yk pihv ptwokn mvcl vco ykkl xnkothmko, tm zca clmt-hwtpcmth.`;
// const clues = { p: 'm' };

// const puzzle = `ce grs'bp arjljcai l vrai ra ylypb lah grs xlzp l qsadf re qlh xcvjlzpv, cj xcifj qp jcxp jr peeldp jfp xsvcd.`;
// const clues = { j: "t" };

// const puzzle = `qtin guetn wdugusiyl isk kzfhzk jisl hj ntz aha lusezd lnuse tifz us whgghs? ahyuwz dzwhdkl.`;
// const clues = { a: "p" };

// const puzzle = `hl refyc vu iunyyx sfq le tuu lbnl nvephqnvyu tqerpnq uqonouc hq n tliuul shobl. yul't oul xulh le ifpvyu!`;
// const clues = { r: "w" };

// const puzzle = `gvm jsgv gmsxvmh vsp ghcniem pmlxhriraf gvm ghrfcacjmghu hnem, lc vm ghrmp s prttmhmag safem.`;
// const clues = { g: "t" };

// const puzzle = `jp lvxsjihfvjt dvhsvflfyi sdy oixy tfblohxvi, asxw hsxc ihfvxy jwpfvbdhjfw afogy jh ex jw hvjgf-echxi?`;
// const clues = { a: "w" };

// const puzzle = `oe l echvqs qshhih elqadcp htrwdnhi, ashch uoxsa fh lwudia vdasovx whea htqhra nh-fcoh.`;
// const clues = { q: "c" };

// const puzzle = `oddqkhmy o sabhrja ufomdecfuhmy wfqhu efadafsad agaruap hud rofyc, vbou vcqjp ubou roqda? ufowwhr gok.`;
//const clues = { y: "g" };

const puzzle = `hmb jvibeu lvguhxyu wbu yp xu yutbuyvgp bdvaghyvu levj hmb fgyaa wbup vl vai cmyqm ubbibi hv zb ebwbxhbian iywwbi yuhv yuo. lvguhxyu wbup mxdb hmbye vcu ebpbedvyep xui ibwbui gwvu texdyhn xui hmb uxhgexa lavc vl ayfgyi hv ceyhb. uyzp xeb jxib vl phxyuabpp phbba ve tvai xui ebwbxhbi gpb qxu cbxe hmb uyz hv hmb gpbe'p mxuiceyhyut, jxoyut yh wbepvuxaysbi.`;
const clues = {};

const Game = ({ puzzle, clues }) => {
  const { puzzleKey, reset, set, clear } = usePuzzleKey();
  const { settingLetter } = useGameInput(set, clear);

  useEffect(() => {
    reset(clues);
  }, [reset, clues, puzzle]);

  const handleClick = useCallback(() => {
    reset(clues);
  }, [reset, clues]);

  return (
    <>
      {settingLetter && <UserInput settingLetter={settingLetter} />}
      <Board puzzle={puzzle} puzzleKey={puzzleKey} />
      <Button color="secondary" onClick={handleClick}>
        Reset
      </Button>
    </>
  );
};

const App = () => {
  const [editing, setEditing] = useState(true);
  const [puzzle, setPuzzle] = useState("");
  const [clueLetter, setClueLetter] = useState("");
  const [clueValue, setClueValue] = useState("");

  return (
    <>
      {editing ? (
        <Stack>
          <input
            value={puzzle}
            onChange={(e) => {
              setPuzzle(e.target.value);
            }}
          />
          <input
            value={clueLetter}
            onChange={(e) => {
              setClueLetter(e.target.value);
            }}
          />
          <input
            value={clueValue}
            onChange={(e) => {
              setClueValue(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              setEditing(false);
            }}
          >
            Done
          </Button>
        </Stack>
      ) : (
        <>
          <Game puzzle={puzzle} clues={{ [clueLetter]: clueValue }} />
          <Button
            onClick={() => {
              setEditing(true);
            }}
          >
            Edit Puzzle
          </Button>
        </>
      )}
    </>
  );
};

export default App;
