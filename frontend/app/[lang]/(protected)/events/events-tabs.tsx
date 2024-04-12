import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { ContentWraper } from '../../ui/content-wraper';
import { Badges } from '../event/badges';
import { DatePicker } from './date-picker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function EventsTabs() {
  return (
    <section className="relative mt-[-92px] flex h-[720px] w-full flex-col items-center justify-between bg-[#0A0A0A] px-[72px] pt-[92px]">
      <Image
        className="opacity-30"
        src="/ru/images/background-events.jpeg"
        alt={'ДОБАВИТЬ ОПИСАНИЕ'}
        fill={true}
        style={{ objectFit: 'cover' }}
      />
      <ContentWraper className="h-fit justify-between">
        <Tabs defaultValue="futureEvents" className="relative mx-auto w-full">
          <div className='w-full'>
            <TabsList className="flex w-full bg-transparent text-[#D6D6D6]">
              <TabsTrigger value="futureEvents">Будущие события</TabsTrigger>
              <TabsTrigger value="pastEvents">Прошедшие события</TabsTrigger>
              <TabsTrigger value="usersEvents">Ваши события</TabsTrigger>
            </TabsList>
            <div className="absolute top-2 right-0 flex items-center space-x-2">
              <Switch id="showMap" />
              <Label className='text-sm font-normal' htmlFor="showMap">На карте</Label>
            </div>
          </div>
          <DatePicker className="flex justify-center" />
          <Badges />
          <TabsContent value="futureEvents">
            <p>Будущие события</p>
          </TabsContent>
          <TabsContent value="pastEvents">
            <p>Прошедшие события</p>
          </TabsContent>
          <TabsContent value="usersEvents">
            <p>Ваши события</p>
          </TabsContent>
        </Tabs>
      </ContentWraper>
    </section>
  );
}
