import React from 'react';
import dayjs from 'dayjs';

import {
   Body,
   Button,
   Column,
   Container,
   Head,
   Heading,
   Hr,
   Html,
   Img,
   Link,
   Preview,
   Row,
   Section,
   Tailwind,
   Text,
} from '@react-email/components';
import type { IAnnouncement } from '../lib/schema';
import type { Summary } from '../../generated/prisma';

interface Props {
   announcements: IAnnouncement[];
   summary: Summary;
}

const announcements = [
   {
      id: 1,
      imageUrl: 'https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334110/image3_djnat5.png',
      title: 'Birthday Celebrations',
      content:
         'This September, we celebrated the gift of life with our beloved brethren: Sister Irene, Bro Meeting, Bro Light, Sister Mishael, Sister Victory and Bro Justin. We rejoice with them and declare that the Lord will crown their new year with His goodness.',
   },
   {
      id: 2,
      imageUrl: 'https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334109/image7_msvzfh.jpg',
      title: 'New Family Members',
      content:
         'Last month, our family grew! We are thrilled to welcome Bro Emeka, Bro Tunde, Sister Janet, and Sis Helen into the RCN fold. Each new soul is a divine addition, and we look forward to discovering the gifts and graces they bring to the house. Welcome home!',
   },
];

const events = [
   {
      title: 'DOZ Prayer Meeting',
      body: 'A time for women to gather in prayer, alignment, and intercession. Theme: Lightbearers Venue: The Forge, Budland Street, Grammar School Bus Stop, Ojodu.',
      date: '2025-10-04',
   },
   {
      title: "Brother's Hangout",
      body: 'A time for brothers to connect, share, and be sharpened on the theme Character & Grit. Venue: The Forge, Budland Street, Grammar School Bus Stop, Ojodu.',
      date: '2025-10-11',
   },
   {
      title: "Believer's Prayer Meeting",
      body: 'An intense atmosphere of prayer and apostolic alignment for all believers. Venue: Citilodge Hotel, 1 Akinyemi Ave, Off Goshen Estate, by Elf Bus Stop, Lekki, Lagos',
      date: '2025-10-18',
   },
];

const NewsletterEmail: React.FC<Props> = ({}) => {
   return (
      <Html>
         <Head />

         <Tailwind>
            <Body className="bg-[#f2f2f2] py-[16px] w-full h-full font-sans">
               <Container className="bg-white p-[32px] h-full" style={container}>
                  <Section className="mt-[48px]">
                     <Img
                        src="https://res.cloudinary.com/dezg6qoig/image/upload/v1757631238/logo_rp5wxm.jpg"
                        width="97"
                        height="57"
                        alt="RCNLagos Island Church"
                        className="object-contain"
                     />
                  </Section>

                  <Section className="mt-[16px]">
                     <Heading style={header}>
                        <strong>RCNLAGOS ISLAND CHURCH</strong>
                     </Heading>

                     <Heading style={subheader}>
                        <strong>REMNANT CHRISTIAN NETWORK</strong>
                     </Heading>

                     <Section style={{ width: '100%', height: '100%', maxHeight: '400px', marginTop: '48px' }}>
                        <Img
                           src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334145/image8_kxx4ay.png"
                           width="100%"
                           height="100%"
                           alt="RCNLagos Island Church"
                           className="object-contain"
                        />
                     </Section>
                  </Section>

                  <Section className="mt-[48px]">
                     <Text style={leftAlignedBody}>
                        <strong>Hi Family,</strong>
                     </Text>

                     <Text className="mt-[8px]" style={leftAlignedBody}>
                        Welcome to <strong>October</strong> 🎉 We joyfully welcome you to a season of refreshing and renewed strength.
                        September was a time of SEPARATION, and now the Lord is calling us higher as we press deeper into His will.
                     </Text>

                     <Text className="mt-[8px]" style={leftAlignedBody}>
                        As brethren, we are reminded of Psalm 133:1 — “Behold, how good and pleasant it is for brethren to dwell together in
                        unity!” This month, we lean into that unity with expectation for a greater outpouring of His Spirit in our midst.
                     </Text>

                     <Hr className="mt-[32px]" />
                  </Section>

                  <Section>
                     <Text style={sectionTitle}>HIGHLIGHTS</Text>

                     <Row align="center" style={socials}>
                        <Column style={{ padding: '0px 10px' }}>
                           <Img
                              src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334112/image10_gkmiqz.jpg"
                              width="100%"
                              height="300"
                              alt="Instagram"
                              className="object-contain"
                           />
                        </Column>

                        <Column style={{ padding: '0px 10px' }}>
                           <Img
                              src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334095/image1_bvodfn.jpg"
                              width="100%"
                              height="300"
                              alt="Instagram"
                              className="object-contain"
                           />
                        </Column>

                        <Column style={{ padding: '0px 10px' }}>
                           <Img
                              src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334102/image2_dbiuf3.jpg"
                              width="100%"
                              height="300"
                              alt="Instagram"
                              className="object-contain"
                           />
                        </Column>
                     </Row>

                     <Text className="mt-[8px]" style={body}>
                        September was such a beautiful month for us as a family. God’s presence was tangible in our gatherings, and our
                        fellowship together was truly refreshing. One of the biggest highlights was the RCN Lagos Convergence; what a
                        powerful time in God’s presence! The theme was “Separated,” and indeed the Lord set us apart afresh for Himself,
                        calling us deeper into consecration and alignment with His purposes.
                     </Text>

                     <Section style={productSection}>
                        <Hr className="mt-[32px] mb-[16px]" />

                        {announcements.map((announcement) => (
                           <Section key={announcement.id} style={tableRow}>
                              <Img src={announcement.imageUrl} style={productImage} alt={announcement.title} className="object-contain" />

                              <Text style={{ ...sectionTitle, textAlign: 'left' }}>{announcement.title}</Text>
                              <Text style={productText}>{announcement.content}</Text>
                           </Section>
                        ))}
                     </Section>
                  </Section>

                  <Section className="mt-[16px]">
                     <Text style={{ ...sectionTitle, width: 'fit', padding: '14px', backgroundColor: '#d4412b', borderRadius: '8px' }}>
                        MARK YOUR CALENDAR
                     </Text>

                     <Section className="mt-[18px]">
                        <table style={table}>
                           <thead>
                              <tr>
                                 <th style={tableHeaderColumn}>Event</th>
                                 <th style={tableHeaderColumn}>Details</th>
                                 <th style={tableHeaderColumn}>Date</th>
                              </tr>
                           </thead>

                           <tbody>
                              {events.map((event) => (
                                 <tr key={event.title}>
                                    <td style={tableBodyColumn}>
                                       <span style={highlight}>{event.title}</span>
                                    </td>
                                    <td style={tableBodyColumn}>{event.body}</td>
                                    <td style={tableBodyColumn}>
                                       <span style={highlight}>{dayjs(event.date).format('DD/MM/YYYY')}</span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>

                        <Hr className="mt-[32px] mb-[16px]" />
                     </Section>

                     <Section>
                        <Text style={sectionTitle}>ANTICIPATE</Text>

                        <Text className="mt-[8px]" style={body}>
                           📌 <strong>CRAFTSMEN 4.0 IS HERE!:</strong> Stay put, stay prayerful, and stay expectant. More details will be
                           shared soon, but be assured that God is set to do a mighty work in our midst.
                        </Text>

                        <Text className="mt-[8px]" style={body}>
                           <strong>RCNLAGOS ISLAND CHURCH ANNIVERSARY:</strong> Our anniversary is around the corner, and we can already
                           sense the joy and glory that awaits us. Keep your hearts expectant, more details coming soon!
                        </Text>

                        <Hr className="my-[16px]" />
                     </Section>

                     <Section>
                        <Text style={sectionTitle}>PRAYER CELLS</Text>

                        <Text className="mt-[8px]" style={body}>
                           Our prayer cells are the heartbeat of our fellowship. Beyond our corporate gatherings, these smaller circles
                           provide the space for brethren to grow in the Word, build stronger bonds, and press deeper in prayer together.
                        </Text>

                        <Text className="mt-[8px]" style={body}>
                           We currently have prayer cells in{' '}
                           <strong>Ikoyi, Victoria Island 1 & 2, Lekki, Igboefon, Alpha Beach, Badore, Sangotedo and Abijo</strong>. Please
                           contact us at <strong>+234 707 779 2632</strong> to learn more and find the location closest to you.
                        </Text>

                        <Hr className="my-[32px]" />
                     </Section>
                  </Section>

                  <Section>
                     <Text style={sectionTitle}>ABOUT US</Text>

                     <Heading className="mt-[16px]" style={subtitle}>
                        About RCN (Remnant Christian Network)
                     </Heading>

                     <Text className="mt-[16px]" style={body}>
                        Remnant Christian Network (RCN) is a global apostolic movement committed to reviving authentic Christianity in our
                        generation. Our mandate is to strive for the rebirth of apostolic Christianity across the nations by raising a
                        people of prayer, sound doctrine, and kingdom service. Through teaching, intercession, and discipleship, RCN is
                        equipping believers to live in alignment with God’s purposes and to be vessels of His glory in their families,
                        communities, and nations.
                     </Text>

                     <Hr className="mt-[32px] mb-0" />
                  </Section>

                  <Section className="mt-[16px]">
                     <Heading style={subtitle}>About RCNLagos Island Church</Heading>

                     <Text className="mt-[8px]" style={body}>
                        RCNLagos Island Church is the Lagos Island expression of Remnant Christian Network Lagos. Planted with the same
                        vision and heartbeat, the RCNLagos Island Church is a thriving family of believers passionate about prayer, the
                        word, and fellowship. Located in the heart of Lekki, the Island Church serves as a hub for equipping, refreshing,
                        and mobilising God’s people for kingdom impact. It’s more than a church; it’s a family where believers are
                        strengthened, aligned, and sent out to live out apostolic Christianity in their everyday lives.
                     </Text>

                     <Hr className="mt-[32px] mb-0" />
                  </Section>

                  <Section className="mt-[16px]">
                     <Heading style={subtitle}>Feeback & Suggestions</Heading>

                     <Text className="mt-[8px]" style={body}>
                        We’d love to hear from you! 💌 Share your feedback and suggestions with us by filling out this short form:{' '}
                        <Link href="https://forms.gle/xR7rxMvh3eKRWf5i6" style={link}>
                           Feeback Form
                        </Link>
                     </Text>

                     <Text className="mt-[8px]" style={body}>
                        ✨ For daily inspiration and timely updates, follow us across our social media platforms below.
                     </Text>

                     <Hr className="mt-[32px] mb-0" />
                  </Section>

                  <Section className="mt-[48px]">
                     <Text style={salutationHeader}>With Love</Text>

                     <Text style={salutationBody}>Reverend. Michael Nsofor</Text>
                  </Section>

                  <Section className="mt-[48px]">
                     <Text style={salutationBody}>
                        Contact Us: <Link style={{ ...link, fontSize: '20px' }}>info@rcnlagosisland.com</Link>
                     </Text>

                     <Hr color="#000000" className="mt-[64px] mb-0" />
                  </Section>

                  <Section className="mt-[24px] justify-center flex w-full">
                     <Row align="center" style={socials}>
                        <Column>
                           <Link href="https://www.instagram.com/rcnlagosisland/">
                              <Img
                                 src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334093/image6_tkovsi.jpg"
                                 width="40"
                                 height="40"
                                 alt="Instagram"
                                 className="object-contain"
                              />
                           </Link>
                        </Column>

                        <Column style={socialSeparator}>
                           <Link href="https://web.facebook.com/profile.php?id=61553792941216">
                              <Img
                                 src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334094/image9_ng3nh5.jpg"
                                 width="40"
                                 height="40"
                                 alt="FaceBook"
                                 className="object-contain"
                              />
                           </Link>
                        </Column>

                        <Column>
                           <Link href="https://www.youtube.com/@RCNLagosIsland">
                              <Img
                                 src="https://res.cloudinary.com/dgdu2dyce/image/upload/v1759334096/image11_snnxaf.png"
                                 width="60"
                                 height="50"
                                 alt="YouTube"
                                 className="object-contain"
                              />
                           </Link>
                        </Column>
                     </Row>
                  </Section>

                  <Section className="mt-[24px]">
                     <Text style={footer}>
                        {process.env.SENDER_NAME} © {new Date().getFullYear()}.
                        <br />
                        Striving for the rebirth of apostolic Christianity.
                     </Text>
                  </Section>
               </Container>
            </Body>
         </Tailwind>
      </Html>
   );
};

const body = {
   fontSize: '16px',
   lineHeight: '24px',
   fontWeight: '500',
   color: '#333333',
   textAlign: 'center' as const,
};

const container = {
   maxWidth: '900px',
   width: '100%',
};

const footer = {
   fontSize: '12px',
   color: '#999999',
   lineHeight: '16px',
   fontWeight: '400',
};

const highlight = {
   backgroundColor: '#d1d5dc',
};

const header = {
   marginTop: '24px',
   lineHeight: '32px',
   fontSize: '30px',
   fontWeight: '700',
   color: '#000000',
   textAlign: 'center' as const,
   textTransform: 'uppercase' as const,
};

const leftAlignedBody = { ...body, textAlign: 'left' as const };

const link = {
   textDecoration: 'underline',
   fontSize: '16px',
   lineHeight: '24px',
   fontWeight: '500',
   textAlign: 'center' as const,
};

const subheader = {
   marginTop: '18px',
   fontSize: '18px',
   fontWeight: '400',
   color: '#000000',
   textAlign: 'center' as const,
   textTransform: 'uppercase' as const,
};

const productSection = {
   width: '100%',
   marginTop: '48px',
};

const productText = {
   color: '#000000',
   fontSize: '14px',
   lineHeight: '20px',
   textAlign: 'left' as const,
   fontWeight: '400',
};

const productImage = {
   width: '100%',
   height: '350px',
   maxHeight: '450px',
   borderRadius: '4px',
};

const salutationBody = {
   color: '#000000',
   fontSize: '20px',
   lineHeight: '24px',
   fontWeight: '700',
   margin: '0px',
   textAlign: 'center' as const,
};

const salutationHeader = {
   color: '#000000',
   fontSize: '16px',
   lineHeight: '24px',
   fontWeight: '400',
   margin: '0px',
   textAlign: 'center' as const,
};

const sectionTitle = {
   textAlign: 'center' as const,
   fontSize: '18px',
   fontWeight: '700',
};

const socials = {
   width: '100%',
   marginBottom: '24px',
   display: 'flex',
   justifyContent: 'center',
   alignItems: 'center',
};

const socialSeparator = {
   padding: '0 16px',
};

const subtitle = {
   fontSize: '18px',
   fontWeight: '700',
   textAlign: 'center' as const,
};

const table = {
   width: '100%',
   borderCollapse: 'collapse' as const,
   border: '5px solid #000000',
};

const tableRow = {
   width: '100%',
   borderBottom: '1px solid #d6d6d6',
   marginBottom: '16px',
};

const tableBodyColumn = {
   padding: '16px',
   fontSize: '16px',
   color: '#000000',
   textAlign: 'center' as const,
};

const tableHeaderColumn = {
   fontSize: '14px',
   fontWeight: '700',
   textAlign: 'center' as const,
   padding: '16px',
   textTransform: 'uppercase' as const,
};

export default NewsletterEmail;
