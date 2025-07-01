import { Global, Module } from '@nestjs/common';
import { lruCacheProvider } from './lru-cache.provider';

@Global()
@Module({
    providers: [lruCacheProvider],
    exports: [lruCacheProvider],
})
export class CacheModule {}
