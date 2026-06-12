import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { canCreateOrUpdateWithPublishGate, isAdminOrReviewer } from '../../access/roles'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { Hero as HeroBlock } from '../../blocks/Hero/config'
import { NewsTicker } from '../../blocks/NewsTicker/config'
import { Timeline } from '../../blocks/Timeline/config'
import { StatsCards } from '../../blocks/StatsCards/config'
import { Awards as AwardsBlock } from '../../blocks/Awards/config'
import { ArticleCards } from '../../blocks/ArticleCards/config'
import { LogoWall } from '../../blocks/LogoWall/config'
import { Quote } from '../../blocks/Quote/config'
import { TwoColumn } from '../../blocks/TwoColumn/config'
import { CtaBanner } from '../../blocks/CtaBanner/config'
import { PageHeader } from '../../blocks/PageHeader/config'
import { NumberedFeatures } from '../../blocks/NumberedFeatures/config'
import { TaCta } from '../../blocks/TaCta/config'
import { VideoBlock } from '../../blocks/VideoBlock/config'
import { MissionCircles } from '../../blocks/MissionCircles/config'
import { IconFeatures } from '../../blocks/IconFeatures/config'
import { StepsBlock } from '../../blocks/StepsBlock/config'
import { Infographic } from '../../blocks/Infographic/config'
import { TabsBlock } from '../../blocks/TabsBlock/config'
import { PillarCards } from '../../blocks/PillarCards/config'
import { MapLocations } from '../../blocks/MapLocations/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: canCreateOrUpdateWithPublishGate,
    delete: isAdminOrReviewer,
    read: authenticatedOrPublished,
    update: canCreateOrUpdateWithPublishGate,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                HeroBlock,
                PageHeader,
                NewsTicker,
                Content,
                Timeline,
                StatsCards,
                AwardsBlock,
                ArticleCards,
                LogoWall,
                Quote,
                TwoColumn,
                NumberedFeatures,
                TaCta,
                VideoBlock,
                MissionCircles,
                IconFeatures,
                StepsBlock,
                Infographic,
                TabsBlock,
                PillarCards,
                MapLocations,
                CtaBanner,
                CallToAction,
                MediaBlock,
                Archive,
              ],
              required: true,
              localized: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
