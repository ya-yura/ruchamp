import Image from 'next/image';
import styles from '@/app/page.module.scss';
import { Text, Display, Title2 } from '@fluentui/react-components';

export default function Home() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-start p-24">
    <main className="">
      <section className="w-full h-[800px] relative">
        <Image
          className="pos"
          src="/fighter-and-ring.avif"
          alt="Боец выходит на ринг"
          fill={true}
          objectFit="cover"
        />
        <div className="absolute top-0 px-9 bg-black/20 w-full h-full flex flex-col justify-center">
          <div className='w-2/5 flex flex-col'>
            <Display as="h1">РуЧамп</Display>
            <Text as="p" size={600} weight="semibold">
              Онлайн-платформа для организации, регистрации и участия в
              соревнованиях и мероприятиях в сфере боевых искусств.
            </Text>
          </div>
        </div>
      </section>
      <section className="w-full bg-black px-7 py-8">
        <div className="w-full flex flex-col gap-5">
          <Title2 as="h2">Это заголовок новой секции</Title2>
          <Text as="p">
            Задача организации, в особенности же постоянное
            информационно-пропагандистское обеспечение нашей деятельности
            способствует подготовки и реализации позиций, занимаемых участниками
            в отношении поставленных задач. Таким образом постоянный
            количественный рост и сфера нашей активности требуют от нас анализа
            систем массового участия. Равным образом консультация с широким
            активом влечет за собой процесс внедрения и модернизации систем
            массового участия. Товарищи! укрепление и развитие структуры
            представляет собой интересный эксперимент проверки соответствующий
            условий активизации. Значимость этих проблем настолько очевидна, что
            сложившаяся структура организации требуют от нас анализа дальнейших
            направлений развития.
          </Text>
          <Text as="p">
            Идейные соображения высшего порядка, а также рамки и место обучения
            кадров способствует подготовки и реализации позиций, занимаемых
            участниками в отношении поставленных задач. Не следует, однако
            забывать, что дальнейшее развитие различных форм деятельности играет
            важную роль в формировании систем массового участия. Таким образом
            консультация с широким активом позволяет выполнять важные задания по
            разработке форм развития. Равным образом реализация намеченных
            плановых заданий в значительной степени обуславливает создание
            системы обучения кадров, соответствует насущным потребностям.
            Значимость этих проблем настолько очевидна, что дальнейшее развитие
            различных форм деятельности позволяет выполнять важные задания по
            разработке системы обучения кадров, соответствует насущным
            потребностям.
          </Text>
        </div>
      </section>

      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div> */}
    </main>
  );
}
