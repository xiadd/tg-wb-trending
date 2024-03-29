import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';

type Props = {
  params: { date: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const date = params.date;

  return {
    title: `微博热搜榜 - ${date}`,
    description: `微博热搜榜 - ${date}`,
  };
}

async function getData(date: string) {
  const res = await fetch(
    `https://cdn.jsdelivr.net/gh/xiadd/tg-wb-trending@master/api/${date}.json`,
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function Hots({ params: { date } }: any) {
  const data = await getData(date || dayjs().format('YYYY-MM-DD'));
  return (
    <main className="p-5 lg:p-0 lg:pt-5">
      <div className="mx-auto max-w-[980px]">
        <Menubar className="flex justify-between">
          <MenubarMenu>
            <Link
              href={`/hots/${dayjs(date)
                .subtract(1, 'day')
                .format('YYYY-MM-DD')}`}
            >
              <MenubarTrigger className="cursor-pointer">前一天</MenubarTrigger>
            </Link>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer">{`${date} 共计 ${data.length} 条热搜`}</MenubarTrigger>
          </MenubarMenu>

          {!dayjs(date).isSame(dayjs().startOf('day')) ? (
            <MenubarMenu>
              <Link
                href={`/hots/${dayjs(date).add(1, 'day').format('YYYY-MM-DD')}`}
              >
                <MenubarTrigger className="cursor-pointer">
                  后一天
                </MenubarTrigger>
              </Link>
            </MenubarMenu>
          ) : (
            <span></span>
          )}
        </Menubar>
      </div>

      <div className="mx-auto flex max-w-[980px] flex-col gap-4 py-8">
        {data.map((item: any) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="block w-full cursor-pointer p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white flex flex-col justify-center md:justify-start md:flex-row md:items-center gap-2">
              {item.title}{' '}
              <div className="flex gap-2 items-center">
                {item.category && <Badge>{item.category.trim()}</Badge>}
                {item.ads && <Badge variant="destructive">推广</Badge>}
                {item.hot && <Badge variant="outline">🔥 {item.hot}</Badge>}
              </div>
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {item.description || '没有描述'}
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}
