import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, RotateCcw, Gift, Star, Laugh, Ticket } from "lucide-react";

export default function ConfessionLoveGame() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // 在这里改成你们的专属名字
  const senderName = "哥哥";
  const receiverName = "王婷小朋友";

  // 把你上传的最终表白网页放到 public/final.html
  // 抽中特等奖后点击“我愿意 ♡”会跳转到这里
  const finalPageUrl = `${import.meta.env.BASE_URL}final.html`;

  const [started, setStarted] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [drawnResult, setDrawnResult] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const retryJokes = [
    "系统提示：丘比特刚刚手滑了，请再刮一次。",
    "差一点点！这张彩票说它还没准备好见证爱情。",
    "再来一次吧，刚才风太大，把特等奖吹跑了。",
    "哎呀，心动信号有点延迟，请重新连接我的喜欢。",
    "本次未中奖，但你已经成功让我的心跳 +99。",
  ];

  const prizes = [
    {
      id: 1,
      title: "再来一次",
      tag: "LUCKY RETRY",
      emoji: "🔁",
      icon: Laugh,
      bg: "bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-200",
      cardBg: "bg-gradient-to-br from-yellow-300 via-orange-300 to-amber-400",
      textColor: "text-orange-900",
      animation: "wiggle",
      description: retryJokes[Math.floor(Math.random() * retryJokes.length)],
      actionText: "不服，再抽一次",
      canRetry: true,
    },
    {
      id: 2,
      title: "心动加成奖",
      tag: "HEART BOOST",
      emoji: "💗",
      icon: Heart,
      bg: "bg-gradient-to-br from-pink-100 via-rose-100 to-fuchsia-200",
      cardBg: "bg-gradient-to-br from-pink-400 via-rose-400 to-fuchsia-500",
      textColor: "text-white",
      animation: "pulse",
      description: `${receiverName} 恭喜你获得一份心动加成：从今天开始，${senderName} 会比以前更主动一点找你，因为真的很想靠近你。`,
      actionText: "收下心动",
      canRetry: false,
    },
    {
      id: 3,
      title: "甜蜜约会券",
      tag: "DATE TICKET",
      emoji: "🍓",
      icon: Ticket,
      bg: "bg-gradient-to-br from-red-100 via-pink-100 to-rose-200",
      cardBg: "bg-gradient-to-br from-red-400 via-pink-400 to-rose-500",
      textColor: "text-white",
      animation: "float",
      description: `${receiverName} 获得一张专属约会券：${senderName} 想请你一起吃饭、散步、看电影，把普通的一天变成很特别的一天。`,
      actionText: "接受邀请",
      canRetry: false,
    },
    {
      id: 4,
      title: "专属陪伴券",
      tag: "COMPANION PASS",
      emoji: "🌙",
      icon: Gift,
      bg: "bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-200",
      cardBg: "bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500",
      textColor: "text-white",
      animation: "glow",
      description: `${receiverName} 恭喜解锁长期陪伴权益：以后开心的时候，${senderName} 想陪你一起笑；不开心的时候，也想陪你慢慢熬过去。`,
      actionText: "继续解锁",
      canRetry: false,
    },
    {
      id: 5,
      title: "特等奖・正式表白",
      tag: "GRAND PRIZE",
      emoji: "💍",
      icon: Star,
      bg: "bg-gradient-to-br from-rose-100 via-pink-100 to-fuchsia-200",
      cardBg: "bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600",
      textColor: "text-white",
      animation: "grand",
      description: `${receiverName}，恭喜你抽中唯一特等奖。其实 ${senderName} 想认真告诉你：我喜欢你。不是一时兴起，而是越来越确定地喜欢你。你愿意和我在一起吗？`,
      actionText: "我愿意 ♡",
      canRetry: false,
      grand: true,
    },
  ];

  function randomPrize() {
    // 这里可以调概率：数字越多，抽中的概率越高
    // 现在“再来一次”概率较高，特等奖概率较低，更像抽卡
    const pool = [1, 1, 1, 2, 2, 3, 3, 4, 4, 5];
    const randomId = pool[Math.floor(Math.random() * pool.length)];
    const prize = prizes.find((item) => item.id === randomId);

    if (prize.id === 1) {
      return {
        ...prize,
        description: retryJokes[Math.floor(Math.random() * retryJokes.length)],
      };
    }

    return prize;
  }

  function setupCanvas() {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#fb7185");
    gradient.addColorStop(0.5, "#ec4899");
    gradient.addColorStop(1, "#d946ef");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = "rgba(255,255,255,0.18)";
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(255,255,255,0.96)";
    ctx.textAlign = "center";
    ctx.font = "bold 30px Arial";
    ctx.fillText("刮开抽卡", rect.width / 2, rect.height / 2 - 14);
    ctx.font = "18px Arial";
    ctx.fillText(`看看 ${receiverName} 抽中了什么`, rect.width / 2, rect.height / 2 + 22);

    setScratchPercent(0);
    setRevealed(false);
    setDrawnResult(null);
    setFlipped(false);
  }

  function startGame() {
    setStarted(true);
    setScratchPercent(0);
    setRevealed(false);
    setDrawnResult(null);
    setFlipped(false);

    setTimeout(() => {
      setupCanvas();
    }, 60);
  }

  function resetGame() {
    setScratchPercent(0);
    setRevealed(false);
    setDrawnResult(null);
    setFlipped(false);

    setTimeout(() => {
      setupCanvas();
    }, 60);
  }

  function getPoint(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function scratch(event) {
    if (!started || revealed) return;

    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const point = getPoint(event);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    calculateScratchPercent();
  }

  function calculateScratchPercent() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percent = Math.round((transparent / (pixels.length / 4)) * 100);
    setScratchPercent(percent);

    if (percent >= 60 && !revealed) {
      const result = randomPrize();

      // 刮开到 60% 后，直接清空遮罩，让抽到的内容完整显示
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setScratchPercent(100);
      setDrawnResult(result);
      setRevealed(true);

      setFlipped(true);
    }
  }

  useEffect(() => {
    if (!started) return;

    const handleResize = () => setupCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [started]);

  function getAnimationProps(result) {
    if (!result) return {};

    if (result.animation === "wiggle") {
      return {
        animate: { rotate: [0, -4, 4, -3, 3, 0], scale: [1, 1.03, 1] },
        transition: { duration: 0.9, repeat: Infinity, repeatDelay: 1.2 },
      };
    }

    if (result.animation === "pulse") {
      return {
        animate: { scale: [1, 1.06, 1] },
        transition: { duration: 1.2, repeat: Infinity },
      };
    }

    if (result.animation === "float") {
      return {
        animate: { y: [0, -8, 0] },
        transition: { duration: 1.6, repeat: Infinity },
      };
    }

    if (result.animation === "glow") {
      return {
        animate: { boxShadow: ["0 0 20px rgba(168,85,247,0.35)", "0 0 45px rgba(168,85,247,0.75)", "0 0 20px rgba(168,85,247,0.35)"] },
        transition: { duration: 1.6, repeat: Infinity },
      };
    }

    if (result.animation === "grand") {
      return {
        animate: { scale: [1, 1.04, 1], boxShadow: ["0 0 25px rgba(236,72,153,0.45)", "0 0 70px rgba(236,72,153,0.95)", "0 0 25px rgba(236,72,153,0.45)"] },
        transition: { duration: 1.5, repeat: Infinity },
      };
    }

    return {};
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-rose-100 via-pink-100 to-fuchsia-200 text-slate-800">
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-8">
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 22 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-300/60"
              initial={{ y: "110vh", opacity: 0 }}
              animate={{ y: "-20vh", opacity: [0, 1, 0] }}
              transition={{
                duration: 7 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 6,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${18 + Math.random() * 28}px`,
              }}
            >
              ♥
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-2xl backdrop-blur md:p-8"
        >
          <div className="mb-6 text-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg"
            >
              <Heart fill="currentColor" size={34} />
            </motion.div>

            <h1 className="text-3xl font-bold tracking-tight text-pink-600 md:text-5xl">
              {receiverName} 的心动刮刮乐
            </h1>
            <p className="mt-3 text-base text-slate-600 md:text-lg">
              由 {senderName} 投放的一张神秘彩票，刮开后随机抽取一张心动卡。
            </p>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-pink-50 p-3">
              <p className="text-xs text-slate-500">刮开进度</p>
              <p className="text-2xl font-bold text-pink-600">{scratchPercent}%</p>
            </div>
            <div className="rounded-2xl bg-fuchsia-50 p-3">
              <p className="text-xs text-slate-500">卡池数量</p>
              <p className="text-2xl font-bold text-fuchsia-600">5 张</p>
            </div>
            <div className="rounded-2xl bg-rose-50 p-3">
              <p className="text-xs text-slate-500">特等奖</p>
              <p className="text-xl font-bold text-rose-600">直接显示</p>
            </div>
          </div>

          <div className="mb-5 h-4 overflow-hidden rounded-full bg-white shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-500"
              animate={{ width: `${Math.min(scratchPercent, 100)}%` }}
            />
          </div>

          <div className="relative min-h-[500px] overflow-hidden rounded-[1.5rem] border border-white bg-gradient-to-br from-white to-pink-50 p-5 shadow-inner md:p-8">
            {!started && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Star className="mb-4 text-pink-500" size={46} />
                <h2 className="text-2xl font-bold text-slate-800">
                  {receiverName} 收到了一张神秘心动彩票
                </h2>
                <p className="mt-3 max-w-md text-slate-600">
                  刮开它，就能随机抽出一张由 {senderName} 准备的专属卡片。
                </p>
                <button
                  onClick={startGame}
                  className="mt-6 rounded-full bg-pink-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-pink-600"
                >
                  开始抽奖
                </button>
              </div>
            )}

            {started && (
              <div className="mx-auto flex min-h-[420px] max-w-2xl flex-col items-center justify-center">
                <div
                  ref={containerRef}
                  className={`relative h-[340px] w-full overflow-hidden rounded-[2rem] border-4 border-pink-200 shadow-2xl ${drawnResult?.bg || "bg-white"}`}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-7 text-center">
                    {!drawnResult ? (
                      <>
                        <motion.div
                          animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                          className="mb-4 text-6xl"
                        >
                          🎫
                        </motion.div>
                        <p className="mb-2 text-sm font-bold tracking-[0.25em] text-pink-400">
                          LOVE LOTTERY
                        </p>
                        <h2 className="text-3xl font-bold text-pink-600 md:text-4xl">
                          正在抽取心动卡...
                        </h2>
                        <p className="mt-4 text-base text-slate-600">
                          快刮开看看 {receiverName} 的抽卡结果
                        </p>
                      </>
                    ) : (
                      <motion.div
                        {...getAnimationProps(drawnResult)}
                        initial={{ opacity: 0, scale: 0.92, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className={`flex h-full w-full flex-col items-center justify-center rounded-[1.5rem] p-6 shadow-xl ${drawnResult.cardBg} ${drawnResult.textColor}`}
                      >
                        {(() => {
                          const Icon = drawnResult.icon;
                          return <Icon size={24} className="mb-2" />;
                        })()}
                        <p className="text-xs font-bold tracking-[0.25em] opacity-90">{drawnResult.tag}</p>
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          className="my-3 text-5xl"
                        >
                          {drawnResult.emoji}
                        </motion.div>
                        <h3 className="text-2xl font-bold md:text-3xl">{drawnResult.title}</h3>
                        <p className="mt-4 max-w-lg leading-8 opacity-95">{drawnResult.description}</p>
                      </motion.div>
                    )}
                  </div>

                  <canvas
                    ref={canvasRef}
                    className={`${revealed ? "hidden" : "absolute inset-0 z-10 touch-none cursor-pointer"}`}
                    onMouseDown={(e) => {
                      setIsDrawing(true);
                      scratch(e);
                    }}
                    onMouseMove={(e) => isDrawing && scratch(e)}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseLeave={() => setIsDrawing(false)}
                    onTouchStart={(e) => {
                      setIsDrawing(true);
                      scratch(e);
                    }}
                    onTouchMove={(e) => isDrawing && scratch(e)}
                    onTouchEnd={() => setIsDrawing(false)}
                  />
                </div>

                <AnimatePresence>
                  {revealed && drawnResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 18 }}
                      className="mt-6 w-full rounded-[1.5rem] bg-white/90 p-5 text-center shadow-lg"
                    >
                      <p className="mb-4 text-sm font-semibold text-slate-500">
                        结果已经写在上面的卡片里啦
                      </p>

                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        {drawnResult.canRetry ? (
                          <button
                            onClick={resetGame}
                            className="rounded-full bg-pink-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-pink-600"
                          >
                            {drawnResult.actionText}
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                if (drawnResult.grand || drawnResult.actionText === "接受邀请") {
                                  window.location.href = finalPageUrl;
                                }
                              }}
                              className="rounded-full bg-pink-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-pink-600"
                            >
                              {drawnResult.actionText}
                            </button>
                            <button
                              onClick={resetGame}
                              className="rounded-full bg-white px-8 py-3 font-semibold text-pink-500 shadow transition hover:scale-105"
                            >
                              再抽一次
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col items-center justify-between gap-3 text-center text-sm text-slate-500 sm:flex-row">
            <p>小提示：抽中特等奖点击“我愿意 ♡”，或抽到甜蜜约会券点击“接受邀请”，都会跳转到最终表白网页。</p>
            {started && (
              <button
                onClick={resetGame}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2 font-semibold text-pink-500 shadow transition hover:scale-105"
              >
                <RotateCcw size={16} />
                重新抽奖
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}