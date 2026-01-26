import { getTranslations } from "next-intl/server";
import TextAnim from "../../../components/TextAnim";

export default async function WorkAtSparagusPage() {
  const t = await getTranslations("careers.workAtSparagus");

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-svh flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <TextAnim useScrollTrigger={false} lightningColor="#8202FF">
            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-normal text-white font-pp-neue-montreal leading-tight">
              {t("title")}
            </h1>
          </TextAnim>
        </div>
      </section>
      
      {/* Description Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-white font-pp-neue-montreal text-center">
            {t("description")}
          </p>
        </div>
      </section>

      {/* Content Section with TextAnim */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
          {/* Section Title */}
          <div className="text-center">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white font-pp-neue-montreal leading-tight">
                Why Work at Sparagus
              </h2>
            </TextAnim>
          </div>

          {/* Paragraph 1 */}
          <div className="max-w-4xl mx-auto">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <p className="text-lg md:text-xl text-white/90 font-pp-neue-montreal leading-relaxed text-center">
                We&apos;re building a team of exceptional individuals who are passionate about connecting talent with opportunity. 
                At Sparagus, you&apos;ll work alongside industry leaders who value innovation, collaboration, and meaningful impact.
              </p>
            </TextAnim>
          </div>

          {/* Subtitle */}
          <div className="max-w-5xl mx-auto pt-8">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <h3 className="text-3xl md:text-4xl  font-normal text-white font-pp-neue-montreal  text-center">
                Growth and Development
              </h3>
            </TextAnim>
          </div>

          {/* Paragraph 2 */}
          <div className="max-w-4xl mx-auto">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <p className="text-lg md:text-xl text-white/90 font-pp-neue-montreal leading-relaxed text-center">
                Your career growth is our priority. We invest in continuous learning, provide mentorship opportunities, 
                and create pathways for advancement. Whether you&apos;re starting your journey or looking to take the next step, 
                we&apos;re here to support your professional development.
              </p>
            </TextAnim>
          </div>

          {/* Subtitle 2 */}
          <div className="max-w-5xl mx-auto pt-8">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white font-pp-neue-montreal leading-tight text-center">
                Collaborative Culture
              </h3>
            </TextAnim>
          </div>

          {/* Paragraph 3 */}
          <div className="max-w-4xl mx-auto">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <p className="text-lg md:text-xl text-white/90 font-pp-neue-montreal leading-relaxed text-center">
                We believe that the best results come from diverse perspectives working together. 
                Our culture encourages open communication, creative problem-solving, and a shared commitment to excellence. 
                Join a team where your voice matters and your contributions make a difference.
              </p>
            </TextAnim>
          </div>
        </div>
      </section>

      {/* White Background Section */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
          {/* Section Title */}
          <div className="text-center">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-black font-pp-neue-montreal leading-tight">
                Join Our Team
              </h2>
            </TextAnim>
          </div>

          {/* Paragraph 1 */}
          <div className="max-w-4xl mx-auto">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <p className="text-lg md:text-xl text-black/80 font-pp-neue-montreal leading-relaxed text-center">
                We&apos;re always looking for talented individuals who share our passion for excellence and innovation. 
                If you&apos;re ready to make an impact and grow with a dynamic team, we&apos;d love to hear from you.
              </p>
            </TextAnim>
          </div>

          {/* Subtitle */}
          <div className="max-w-5xl mx-auto pt-8">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <h3 className="text-3xl md:text-4xl font-normal text-black font-pp-neue-montreal text-center">
                Open Positions
              </h3>
            </TextAnim>
          </div>

          {/* Paragraph 2 */}
          <div className="max-w-4xl mx-auto">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <p className="text-lg md:text-xl text-black/80 font-pp-neue-montreal leading-relaxed text-center">
                Explore our current openings and find the perfect role that matches your skills and aspirations. 
                We offer competitive packages, flexible working arrangements, and opportunities for professional growth.
              </p>
            </TextAnim>
          </div>
        </div>
      </section>
    </div>
  );
}
